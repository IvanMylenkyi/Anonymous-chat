//Желательно полный crud, но по факту - создание, удаление сессии,
//  получение сессии по sessionID, с
// создание, удаление чата, получение чата по сессии, 
// создание сообщений, получение сообщений через чат, удаление сообщений


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat } from "@prisma/client";
import { CoreService } from 'src/core/core.service';
import { Request } from 'express';



@Injectable()
export class ChatService {
  constructor(private readonly prisma:  PrismaService, private readonly coreService: CoreService){}

    async getChat(req: Request){
        let sessionID = req.cookies["sessionID"];
        let chat = await this.coreService.getChatBySession(sessionID);
        if (chat){
          return {title: `Chat ${chat.id}`, error: "", messages: await this.coreService.getAllMessagesInChat(chat.id)};
        }
        return {title: "Chat error", error: "chat not found", messages: []};
    }

    async updateSocketID(sessionID: string, socketID: string){
      await this.prisma.session.update({
        where: {sessionID: sessionID},
        data: {
          socketID: socketID
        }
      })
    }
}

