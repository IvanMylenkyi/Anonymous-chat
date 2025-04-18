import { Injectable } from "@nestjs/common";
import { contains } from "class-validator";
import { Request, Response } from "express";
import { Session } from "inspector/promises";
import { CoreService } from "src/core/core.service";
import { UpdateSessionDto } from "src/core/dto/update-session.dto";
import { EventService } from "src/event-emmiter/event.service";
import { PrismaService } from "src/prisma.service";
import { EventEmitter } from "stream";



@Injectable()
export class SearchService{
    constructor(private readonly prisma:PrismaService,
        private readonly coreService:CoreService,
        private readonly eventService: EventService
    ){}
    
    // async connectSessions(updateSessionDto:UpdateSessionDto):Promise<any>{
        
    //     // NOT WORKING -> cannot read status properties ("undefined") 36 line
        
    //     const sessions = await this.prisma.session.count()
    //     const foundsessions = await this.prisma.session.findMany({
    //         where:{status:false},
    //           take: 2,
    //           skip: Math.floor(Math.random() * (sessions - 2)),
              
    //     })
        
    //     const ids = foundsessions.map(session => session.id);
    //     return await this.prisma.session.updateManyAndReturn({
    //         where:{id:{
    //             in: ids
    //         },
    //     },
    //     data:{
    //         status: !updateSessionDto.status
    //     }
    //     })
    // }
    getSearch(){
        return {title: "Search"};
    }
    
    async searchForChat(req: Request, res: Response): Promise<void>{
        let session = req.cookies["sessionID"];
        try{
            let sessionRecord = await this.coreService.getSessionBySessionID(session);
            let chat = await this.coreService.getChatBySession(sessionRecord.sessionID);
            if (chat){
                try{
                    await this.coreService.removeChat({ sessionID: sessionRecord.sessionID });
                } catch {

                }
            }
        } catch {
            await this.coreService.createSession({sessionID: session})
        }
        return new Promise(async (resolve)=>{
            this.eventService.eventEmmiter.removeAllListeners(session);
            console.log(this.eventService.eventEmmiter.listeners(session))
            let isOver = false;
            let callback = ()=>{
                isOver = true;
            }
            await this.prisma.session.update({
                where: {
                    sessionID: session
                },
                data: {
                    status: true
                }
            })
            let waitInter = setInterval(()=>{
                if (!isOver){
                    if (this.eventService.eventEmmiter.listenerCount(session) <= 0){
                        this.eventService.on(session, callback)
                    }
                }
                else{
                    clearInterval(waitInter);
                    console.log("Listening is over", session)
                    this.eventService.eventEmmiter.removeAllListeners(session);
                    res.json({message: "Чат найден!"});
                    resolve();
                }
            });
            setTimeout(async ()=>{
                clearInterval(waitInter);
                await this.prisma.session.update({
                    where: {
                        sessionID: session
                    },
                    data: {
                        status: false
                    }
                })
            }, 30000);
        });
        
        
    }
    
}
