import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat, Session, Message } from "@prisma/client";
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { response } from 'express';
import { EventService } from 'src/event-emmiter/event.service';

@Injectable()
export class CoreService implements OnModuleInit {
  constructor(private readonly prisma:  PrismaService, private readonly eventService: EventService){}

    async onModuleInit() {
      setInterval(async ()=>{
        try{
          const [session1, session2] = await this.pairOfSessionsForChat();
          console.log(session1, session2)
          if (session1.id != session2.id){
            let chat = await this.getChatBySession(session1.sessionID);
            if (chat){
                try{
                    await this.removeChat({ sessionID: session1.sessionID });
                } catch {

                }
            }
            chat = await this.getChatBySession(session2.sessionID);
            if (chat){
                try{
                    await this.removeChat({ sessionID: session2.sessionID });
                } catch {

                }
            }
            console.log(0)
            await this.createChat({sessionID1: session1.sessionID, sessionID2: session2.sessionID});
            console.log("Chat was succesfully created")
            this.eventService.emit(session1.sessionID);
            this.eventService.emit(session2.sessionID);
          }
        } catch {

        }
        // await new Promise(resolve => setTimeout(resolve, 1000));
      }, 1000)
    }

  //passed
  async getAllSessions(): Promise<Session[]>{
    return await this.prisma.session.findMany()
  }

  async deleteAllSessions(){
    return await this.prisma.session.deleteMany();
  }

  async getSessionBySessionID(sessionID:string): Promise<Session>{
    const session = await this.prisma.session.findUnique({
      where:{
        sessionID: sessionID
      }
      
    })

    if (!session) {
      throw new NotFoundException("session not found")
    }
    // console.log(session.sessionID)

    return session
  }
  //passed

  async createSession(createSessionDto: CreateSessionDto): Promise<Session>{


    
      return await this.prisma.session.create({
        data:{
          sessionID:createSessionDto.sessionID,
          endTime: new Date(Date.now()+1000*60*60*24),
          status: false,

        
  
        }
      })
    

    
     
  }
//passed
  async removeSession(sessionID:string): Promise<void> {
    const session = await this.getSessionBySessionID(sessionID);
    // console.log("remove stage",session.sessionID)

    await this.prisma.session.delete({where:{sessionID: sessionID}})
  }
//passed
  async updateSession(updateSessionDto:UpdateSessionDto): Promise<Session>{
    const session = await this.getSessionBySessionID(updateSessionDto.sessionID);

    if (!session) throw new NotFoundException("Session not found")

    return this.prisma.session.update({
      where:{
        sessionID: updateSessionDto.sessionID
      },
      data:{
        status: !session.status
      }
    })

  }
//passed
  async getChatBySession(sessionID:string): Promise<Chat | null>{
      return this.prisma.chat.findFirst({
          where: {
              sessions: {
                  some: { sessionID: sessionID }  
              }
          }
        })
    }
  //passed
    async createChat(createChatDto:CreateChatDto): Promise<Chat>{
      const session1 = await this.getSessionBySessionID(createChatDto.sessionID1);
      const session2 = await this.getSessionBySessionID(createChatDto.sessionID2);
      console.log(1)

      if (!session1 || !session2) throw new NotFoundException("1 or 2 sessions not found")
  
      console.log(2)
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
      //passed
      async removeChat(createSessionDto:CreateSessionDto): Promise<void>{
        const session = await this.getSessionBySessionID(createSessionDto.sessionID);
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
//passed
      await this.prisma.chat.delete({
        where:{
          id: chat?.id
        }
      })
          
    }
    //passed
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
    async removeAllMessagesInChat(createSessionDto:CreateSessionDto): Promise<void>{
      const chat = await this.getChatBySession(createSessionDto.sessionID)
      if (!chat) throw new NotFoundException("Chat not found")

      await this.prisma.message.deleteMany({
        where:{chatId: chat?.id}
      })
    }
    
    async pairOfSessionsForChat(): Promise<any>{

      // const sessionsCount = await this.prisma.session.count({ where: { status: true } });

      // if (sessionsCount < 2) {
      //     throw new Error('Not enough sessions with status true to update');
      // }

      // const randomIndex1 = Math.floor(Math.random() * sessionsCount);
      // const randomIndex2 = Math.floor(Math.random() * sessionsCount);


      // let secondIndex = randomIndex2;
      // while (secondIndex == randomIndex1) {
      //     secondIndex = Math.floor(Math.random() * sessionsCount);
      // }

      // console.log(randomIndex1, secondIndex)

      // // console.log('Random indices:', randomIndex1, secondIndex);

      // const [session1, session2] = await Promise.all([
      //     this.prisma.session.findFirst({ where: { status: true }, skip: randomIndex1 }),
      //     this.prisma.session.findFirst({ where: { status: true }, skip: secondIndex }),
      // ]);
      const sessions = await this.prisma.session.findMany({
        where: { status: true }
      });

      if (sessions.length < 2){
        throw new Error('Not enough sessions with status true to update');
      }

      let sessionIdsList: number[] = [];
      for (let i = 0; i < sessions.length; i++){
        sessionIdsList.push(sessions[i].id);
      }

      let id = Math.floor(Math.random() * sessionIdsList.length)
      const session1 = await this.prisma.session.findUnique({
        where: { id: sessionIdsList[id] }
      })
      sessionIdsList.splice(id, 1);

      id = Math.floor(Math.random() * sessionIdsList.length)
      const session2 = await this.prisma.session.findUnique({
        where: { id: sessionIdsList[id] }
      })
      

      if (!session1 || !session2) {
          throw new Error('Failed to find sessions');
      }

      // console.log('Found sessions:', session1, session2);
      if (session1.id != session2.id){
        await this.prisma.session.update({
          where:{
            sessionID: session1.sessionID
          },
          data:{
            status: false
          }
        })

        await this.prisma.session.update({
          where:{
            sessionID: session2.sessionID
          },
          data:{
            status: false
          }
        })

        const [session1upd, session2upd] = await Promise.all([
          this.prisma.session.findFirst({ where: { id: session1.id }}),
          this.prisma.session.findFirst({ where: { id: session2.id }}),
      ]);
          return [session1upd, session2upd]
      }
      return [session1, session2]
}}

  

