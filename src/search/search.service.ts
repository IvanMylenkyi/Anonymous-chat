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
        return {layout: "base", title: "Search"};
    }
    
    async searchForChat(req: Request, res: Response): Promise<void>{
        let session = req.cookies["sessionID"];
        try{
            await this.coreService.getSessionBySessionID(session);
        } catch {
            await this.coreService.createSession({sessionID: session})
        }
        return new Promise(async (resolve)=>{
            let isOver = false;
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
                    if (this.eventService.eventEmmiter.listenerCount(session) <= 0)
                    this.eventService.on(session, ()=>{
                        isOver = true;
                    })
                }
                else{
                    clearInterval(waitInter);
                    res.json({message: "Чат найден!"});
                    resolve();
                }
            });
        });
        
        
    }
    
}
