//Желательно полный crud, но по факту - создание, удаление сессии,
//  получение сессии по sessionID, с
// создание, удаление чата, получение чата по сессии, 
// создание сообщений, получение сообщений через чат, удаление сообщений


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat, Session } from "@prisma/client";
import { CoreService } from 'src/core/core.service';





@Injectable()
export class ChatService {
  constructor(private readonly prisma:  PrismaService,
    private coreService: CoreService
  ){}


  async getChatBySession(sessionID:string): Promise<Chat | null>{
    return this.prisma.chat.findFirst({
        where: {
            sessions: {
                some: { sessionID: sessionID }  
            }
        }
      })
  }

  async createChat(sessionID1: string, sessionID2: string): Promise<Chat>{
    const session1 = await this.coreService.getBySessionID(sessionID1);
    const session2 = await this.coreService.getBySessionID(sessionID2);

    if (!session1 || !session2) throw new NotFoundException("1 или 2 сессии не найдены")

    return this.prisma.chat.create({
         data: {
             sessions: {
                 connect: [
                     { id: session1.id },
                     { id: session2.id }
                 ]
             }
         },
         include: {
             sessions: true
         }
     });
    }
    async removeChat(sessionID: string): Promise<void>{
        await this.prisma.chat.deleteMany({
            where: {
                sessions: {
                    some: { sessionID: sessionID }
                }
            }
        });
    }
  }

