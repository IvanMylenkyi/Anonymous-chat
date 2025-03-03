import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { CoreService } from './core.service';


@Injectable()
// @Controller('chat')
export class CoreController {
    constructor(private readonly coreService: CoreService){}
    //test endpoint

    @Post("session")
    async getSessionBySessionIDtest(@Body() body:{sessionID:string}){
        return await this.coreService.getSessionBySessionID(body.sessionID)
    }
}