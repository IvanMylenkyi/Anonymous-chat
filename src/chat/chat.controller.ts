import { Body, Controller, Get, Post, Render, Req } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request } from "express";
import { setDefaultAutoSelectFamily } from "net";


@Controller()
export class ChatController{
    constructor(private readonly chatService: ChatService){}

    @Get("chat/")
    @Render("chat")
    getChat(@Req() req: Request){
        return this.chatService.getChat(req);
    }

    @Post("updateSocketID/")
    async updateSocket(@Req() req: Request){
        await this.chatService.updateSocketID(req.body["sessionID"], req.body["socketID"])
    }
}