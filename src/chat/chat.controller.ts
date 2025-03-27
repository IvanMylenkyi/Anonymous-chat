import { Controller, Get, Render, Req } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request } from "express";


@Controller()
export class ChatController{
    constructor(private readonly chatService: ChatService){}

    @Get("chat/")
    @Render("chat")
    getChat(@Req() req: Request){
        return this.chatService.getChat(req);
    }
}