import { Body, Controller, Get, Post, Redirect, Render, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller("admin")
export class AdminController{
    constructor(private readonly adminService: AdminService){}

    @Get()
    @Render("admin")
    async getAdmin(){
        return await this.adminService.getAdmin();
    }

    @Post("getSchema")
    async getSchema(@Req() req: Request){
        if (req.is("xml")){
            return this.adminService.getSchema(req.body);
        }
        return null;
    }

    @Post("createRecord")
    @UseInterceptors(FileInterceptor("file"))
    @Redirect("/admin", 301)
    async createRecord(@Body() form: Record<string, any>, @UploadedFile() file: Express.Multer.File){
        return await this.adminService.createRecord(form);
    }
}