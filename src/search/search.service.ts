import { Injectable } from "@nestjs/common";
import { contains } from "class-validator";
import { Session } from "inspector/promises";
import { CoreService } from "src/core/core.service";
import { UpdateSessionDto } from "src/core/dto/update-session.dto";
import { PrismaService } from "src/prisma.service";




@Injectable()
export class SearchService{
    constructor(private readonly prisma:PrismaService,
        coreService:CoreService

    ){}
    
    async connectSessions():Promise<any>{
        
        //NOT WORKING -> cannot read status properties ("undefined") 36 line
        
        const sessions = await this.prisma.session.count()
        const foundsessions = await this.prisma.session.findMany({
            where:{status:false},
              take: 2,
              skip: Math.floor(Math.random() * (sessions - 2)),
              
        })

        
        const ids = foundsessions.map(session => session.id);
        const st = foundsessions.map(session => session.status)
        console.log(st)
        return await this.prisma.session.updateManyAndReturn({
            where:{id:{
                in: ids
            },
        },
        data:{
            status: !st[0]
        }
        })
}
    
    
}
