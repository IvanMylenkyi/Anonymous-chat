import { Controller, Get } from "@nestjs/common";
import { SearchService } from "./search.service";
import { UpdateSessionDto } from "src/core/dto/update-session.dto";



@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService){}

    @Get()
    async getPairOfSessions(updateSessionDto:UpdateSessionDto){
        return this.searchService.connectSessions(updateSessionDto)
    }

}