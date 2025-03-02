import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoreDto } from './dto/create-core.dto';
import { UpdateCoreDto } from './dto/update-core.dto';
import { PrismaService } from 'src/prisma.service';
import { Session } from "@prisma/client";



@Injectable()
export class CoreService {
  constructor(private readonly prisma:  PrismaService){}

  async getBySessionID(sessionID:string): Promise<Session>{
    const session = await this.prisma.session.findUnique({
      where:{
        sessionID:sessionID
      }
    })
    if (!session) throw new NotFoundException("Session not found")

    return session
  }

  async createSession(createCoreDto: CreateCoreDto): Promise<Session>{

    return this.prisma.session.create({
      data:{
        sessionID:createCoreDto.sessionID,
        endTime: new Date(Date.now()+1000*60*60*24),
        status: false,

      }
    })
  }

  async removeSession(sessionID:string): Promise<Session> {
    const session = await this.getBySessionID(sessionID);

    return this.prisma.session.delete({where:{sessionID: sessionID}})
  }

  async updateSession(sessionID:string, UpdateCoreDto:UpdateCoreDto): Promise<Session>{
    const session = await this.getBySessionID(sessionID);

    return this.prisma.session.update({
      where:{
        sessionID: sessionID
      },
      data:{
        status: !UpdateCoreDto.status
      }
    })



  }

  
}
