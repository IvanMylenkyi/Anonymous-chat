import { Controller, Get, Post, Render, Req } from "@nestjs/common";
import { SearchService } from "./search.service";
import { UpdateSessionDto } from "src/core/dto/update-session.dto";
import { Request, Response } from "express";



@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService){}

    @Get()
    @Render("search")
    getSearch(){
        return this.searchService.getSearch();
    }
    
    @Post()
    async searchForChat(@Req() req: Request, res: Response){
        return this.searchService.searchForChat(req, res);
    }
    // @Get()
    // async getPairOfSessions(updateSessionDto:UpdateSessionDto){
    //     return this.searchService.connectSessions(updateSessionDto)
    // }

}