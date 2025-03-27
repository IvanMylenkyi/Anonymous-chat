import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CoreService } from './core.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { WebSocketDto } from './dto/websocket.dto';
import { PrismaService } from 'src/prisma.service';


@WebSocketGateway(8080, { cors: { origin: '*' } })
export class CoreGateway {
  constructor(private readonly coreService: CoreService, private readonly prisma:  PrismaService) {}

  @SubscribeMessage('message')
  async send(@MessageBody() message: WebSocketDto){
    try{
      let session = await this.coreService.getSessionBySessionID(message["sessionID"]);
      if (session.socketID != message["websocketID"]){
        console.log(message["message"])
        await this.prisma.session.update({
          where: {sessionID: message["sessionID"]},
          data: {
            socketID: message["websocketID"]
          }
        })
      }
      let chat = await this.coreService.getChatBySession(session.sessionID);
    } catch {}

    
  }
  // @SubscribeMessage('createCore')
  // create(@MessageBody() createSessionDto: CreateSessionDto) {
  //   return this.coreService.create(createSessionDto);
  // }

  // @SubscribeMessage('findAllCore')
  // findAll() {
  //   return this.coreService.findAll();
  // }

  // @SubscribeMessage('findOneCore')
  // findOne(@MessageBody() id: number) {
  //   return this.coreService.findOne(id);
  // }

  // @SubscribeMessage('updateCore')
  // update(@MessageBody() updateSessionDto: UpdateSessionDto) {
  //   return this.coreService.update(updateSessionDto.id, updateSessionDto);
  // }

  // @SubscribeMessage('removeCore')
  // remove(@MessageBody() id: number) {
  //   return this.coreService.remove(id);
  // }
}
