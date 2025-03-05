import { Controller, Get, Render } from "@nestjs/common";
import { ChatService } from "./chat.service";


@Controller()
export class ChatController{
    constructor(private readonly chatService: ChatService){}

    @Get("chat/")
    @Render("chat")
    getChat(){
        this.chatService.getChat();
    }
}