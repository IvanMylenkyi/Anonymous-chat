import { Injectable, OnModuleInit } from "@nestjs/common";
import { isArray } from "class-validator";
import { PrismaService } from "src/prisma.service";


@Injectable()
export class AdminService implements OnModuleInit{
    private tables: Array<Object>= [];
    private columns: Object = {};
    private relations: any;
    private relationsAsObject: Object = {};
    constructor(private readonly prisma: PrismaService){

    }
    async onModuleInit() {
        this.tables = await this.prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        for (let i = 0; i<this.tables.length; i++){
            if (this.tables[i]["table_name"] == "_prisma_migrations"){
                this.tables.splice(i, 1);
            }
        }
        for (let i = 0; i<this.tables.length; i++){
            this.columns[this.tables[i]["table_name"]] = await this.prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${this.tables[i]["table_name"]}`;
        }
        this.relations = await this.prisma.$queryRaw`
        SELECT
          kcu.table_name AS from_table,
          kcu.column_name AS from_column,
          ccu.table_name AS to_table,
          ccu.column_name AS to_column
        FROM
          information_schema.key_column_usage kcu
        JOIN
          information_schema.table_constraints tc 
          ON kcu.constraint_name = tc.constraint_name
        JOIN
          information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
        WHERE
          tc.constraint_type = 'FOREIGN KEY' 
          AND kcu.table_schema = 'public';`;
        
        console.log(this.relations);
        console.log(this.columns);
        for (let relation of this.relations){
            for (let i = 0; i < this.columns[relation["from_table"]].length; i++){
                if (this.columns[relation["from_table"]][i]["column_name"] == relation["from_column"]){
                    this.columns[relation["from_table"]][i]["data_type"] = "relation";
                    if (!this.relationsAsObject.hasOwnProperty(relation["from_table"])){
                        this.relationsAsObject[relation["from_table"]] = {};
                    }
                    this.relationsAsObject[relation["from_table"]][relation["from_column"]] = { table: relation["to_table"], data: [], column: relation["to_column"], isParent: false };
                }
            }
            for (let j = 0; j < this.columns[relation["to_table"]].length; j++){
                if (this.columns[relation["to_table"]][j]["column_name"] == relation["to_column"]){
                    this.columns[relation["to_table"]].push({ column_name: relation["from_table"].toLowerCase()+"Id", data_type: "relation-many" })
                    if (!this.relationsAsObject.hasOwnProperty(relation["to_table"])){
                        this.relationsAsObject[relation["to_table"]] = {};
                    }
                    this.relationsAsObject[relation["to_table"]][relation["from_table"].toLowerCase()+"Id"] = { table: relation["from_table"], data: [], column: relation["from_column"], isParent: true };
                }
            }
        }
        console.log(this.relationsAsObject);
    }

    async getAdmin(){
        return {tables: this.tables, columns: this.columns};
    }

    async getSchema(schema: Object){
        let resp = this.columns[schema["name"]];
        let reo = this.relationsAsObject[schema["name"]];
        for (let column in reo){
            reo[column]["data"] = await this.prisma.$queryRawUnsafe(`SELECT id FROM "${reo[column]["table"]}"`);
        }
        resp.unshift({ column_name: "__relations", relations: this.relationsAsObject[schema["name"]] })
        return resp;
    }

    async createRecord(form: any){
        let prismaReq = {};
        let prismaReqOthers = {};
        if (Object.keys(this.columns).includes(form["model-name"])){
            let formColumns = Object.keys(form);
            for (let column of this.columns[form["model-name"]]){
                if (formColumns.includes(column["column_name"])){
                    prismaReq[column["column_name"]] = form[column["column_name"]]
                }
            }
        }
        for (let column of Object.keys(prismaReq)){
            if (this.relationsAsObject[form["model-name"]].hasOwnProperty(column)){
                if(this.relationsAsObject[form["model-name"]][column]["isParent"]){
                    if(prismaReqOthers.hasOwnProperty(this.relationsAsObject[form["model-name"]][column]["table"])){
                        prismaReqOthers[this.relationsAsObject[form["model-name"]][column]["table"]][this.relationsAsObject[form["model-name"]][column]["column"]] = prismaReq[column];
                    } else {
                        prismaReqOthers[this.relationsAsObject[form["model-name"]][column]["table"]] = {};
                        prismaReqOthers[this.relationsAsObject[form["model-name"]][column]["table"]][this.relationsAsObject[form["model-name"]][column]["column"]] = prismaReq[column];
                    }
                    delete prismaReq[column];
                }
            }
        }
        let parentId = prismaReq["id"];
        if (isNaN(Number(prismaReq["id"])) || String(Number(prismaReq["id"])) != prismaReq["id"]){
            delete prismaReq["id"];
        }
        if (!prismaReq.hasOwnProperty("id")){
            let keys = Object.keys(prismaReq).map(v => `"${v}"`).join(", ");
            let values = Object.values(prismaReq).map(v => (typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v)).join(", ");
            let req = `INSERT INTO "${form["model-name"]}" (${keys}) VALUES (${values}) RETURNING id`;
            if (req != `INSERT INTO "${form["model-name"]}" () VALUES () RETURNING id`){
                parentId = await this.prisma.$queryRawUnsafe(req);
            } else {
                parentId = await this.prisma.$queryRawUnsafe(`INSERT INTO "${form["model-name"]}" DEFAULT VALUES RETURNING id`);
            }
            parentId = parentId[0]["id"]
        } else {
            let rec: Array<Object> = await this.prisma.$queryRawUnsafe(`SELECT * FROM "${form["model-name"]}" WHERE id = ${prismaReq["id"]}`);
            if (rec.length > 0){
                let reqLine: string[] = [];
                for (let key of Object.keys(prismaReq)){
                    if (key == "id"){
                        continue
                    }
                    if (prismaReq[key] == "None"){
                        prismaReq[key] = '';
                    }
                    reqLine.push(`"${key}" = ${prismaReq[key]}`);
                }
                await this.prisma.$queryRawUnsafe(`UPDATE "${form["model-name"]}" SET ${reqLine.join(", ")} WHERE id = ${prismaReq["id"]}`)
            } else {
                await this.prisma.$queryRawUnsafe(`INSERT INTO "${form["model-name"]}" (${Object.keys(prismaReq).join(", ")}) VALUES (${Object.values(prismaReq).join(", ")})`);
            }
        }
        for (let key of Object.keys(prismaReqOthers)){
            for (let inKey of Object.keys(prismaReqOthers[key])){
                if (isArray(prismaReqOthers[key][inKey])){
                    for (let id of prismaReqOthers[key][inKey]){
                        console.log(`UPDATE "${key}" SET ${inKey} = ${parentId} WHERE id = ${id}`)
                        await this.prisma.$queryRawUnsafe(`UPDATE "${key}" SET "${inKey}" = ${parentId} WHERE "id" = ${id}`)
                    }
                } else {
                    if (prismaReqOthers[key][inKey] == "None"){
                        prismaReqOthers[key][inKey] = '';
                    }
                    await this.prisma.$queryRawUnsafe(`UPDATE "${key}" SET "${inKey}" = ${parentId} WHERE "id" = ${prismaReqOthers[key][inKey]}`)
                }
            }
        }
        return;
    }
}