//Желательно полный crud, но по факту - создание, удаление сессии,
//  получение сессии по sessionID, с
// создание, удаление чата, получение чата по сессии, 
// создание сообщений, получение сообщений через чат, удаление сообщений


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat } from "@prisma/client";
import { CoreService } from 'src/core/core.service';



@Injectable()
export class ChatService {
  constructor(private readonly prisma:  PrismaService){}

    getChat(){
        return {};
    }
}

