import { Body, Controller, Delete, Get, Injectable, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoreService } from './core.service';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';


@Injectable()
@Controller('chat')
export class CoreController {
    constructor(private readonly coreService: CoreService){}
    //test endpoint

    //passed
    @Post("session")
    async getSessionBySessionIDtest(@Body() body: { sessionID: string }){
        console.log("SessionID:", body.sessionID)
        return await this.coreService.getSessionBySessionID(body.sessionID)
    }
    
    @UsePipes(new ValidationPipe())
    //passed
    
    @Post("createsession")
    async createSessionBySessionIDtest(@Body() createSessionDto:CreateSessionDto){
        return await this.coreService.createSession(createSessionDto)

    }
    //passed

    @Delete('removesession')
    async removeSessionBySessionIDtest(@Body() body: { sessionID: string }){
        return await this.coreService.removeSession(body.sessionID)
    }

    
    //passed

    @Put('updsession')
    async updSessionBySessionIDtest(@Body() updateSessionDto:UpdateSessionDto){
        return await this.coreService.updateSession(updateSessionDto)
    }
    //passed

    @Post("createchat")
    async createChatBySessionIDstest(@Body() createChatDto:CreateChatDto){
        return await this.coreService.createChat(createChatDto)
        

    }
//passed
    @Delete('removechat')
    async deleteChatBySessionIDtest(@Body() createSessionDto:CreateSessionDto){
        return await this.coreService.removeChat(createSessionDto)
//passed
    }
    @Get(':id')
    async getMessagesByChatIdtest(@Param("id") id: number){
        return await this.coreService.getAllMessagesInChat(+id)
    }
//passed
    @Post("createmsg")
    async createMessagetest(@Body() createMessageDto:CreateMessageDto){
        return await this.coreService.createMessage(createMessageDto)

    }
    //passed
    @Delete("removemsg")
    async removeMessagestest(@Body() createSessionDto:CreateSessionDto){
        return await this.coreService.removeAllMessagesInChat(createSessionDto)
    }
}
