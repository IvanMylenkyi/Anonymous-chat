import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat, Session, Message } from "@prisma/client";
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class CoreService {
  constructor(private readonly prisma:  PrismaService){}


  async getSessionBySessionID(sessionID:string): Promise<Session>{
    const session = await this.prisma.session.findUnique({
      where:{
        sessionID:sessionID
      }
    })
    if (!session) throw new NotFoundException("Session not found")

    return session
  }

  async createSession(createSessionDto: CreateSessionDto): Promise<Session>{
    return this.prisma.session.create({
      data:{
        sessionID:createSessionDto.sessionID,
        endTime: new Date(Date.now()+1000*60*60*24),
        status: false,

      }
    })
  }

  async removeSession(sessionID:string): Promise<Session> {
    const session = await this.getSessionBySessionID(sessionID);

    if (!session) throw new NotFoundException("Session not found")

    return this.prisma.session.delete({where:{sessionID: sessionID}})
  }

  async updateSession(sessionID:string, UpdateSessionDto:UpdateSessionDto): Promise<Session>{
    const session = await this.getSessionBySessionID(sessionID);

    if (!session) throw new NotFoundException("Session not found")

    return this.prisma.session.update({
      where:{
        sessionID: sessionID
      },
      data:{
        status: !UpdateSessionDto.status
      }
    })

  }

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
      const session1 = await this.getSessionBySessionID(sessionID1);
      const session2 = await this.getSessionBySessionID(sessionID2);
  
      if (!session1 || !session2) throw new NotFoundException("1 or 2 sessions not found")
  
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
        const session = await this.getSessionBySessionID(sessionID);
        if (!session) throw new Error("session not found");
      
      const chat = await this.prisma.chat.findFirst({
        where:{
          sessions:{
            some:{
              id: session.id
            }
          }
        }
      });

      await this.prisma.chat.delete({
        where:{
          id: chat?.id
        }
      })
          
    }
    
    async getAllMessagesInChat(chatId:number): Promise<Message[]>{
      return await this.prisma.message.findMany({
        where:{chatId:chatId}
      })
    }

    async createMessage(createMessageDto:CreateMessageDto): Promise<Message>{
      return await this.prisma.message.create({
        data:{
          chatId:createMessageDto.chatId,
          owner:createMessageDto.owner,
          text:createMessageDto.text,
        }
      })

    }
    async removeAllMessagesInChat(sessionID: string): Promise<void>{
      const chat = await this.getChatBySession(sessionID)
      if (!chat) throw new NotFoundException("Chat not found")

      await this.prisma.message.deleteMany({
        where:{chatId: chat?.id}
      })
    }


}

  

