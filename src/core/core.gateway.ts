import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { CoreService } from './core.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { WebSocketDto } from './dto/websocket.dto';
import { PrismaService } from 'src/prisma.service';
import { Server, Socket } from "socket.io";
import { IsString } from 'class-validator';

@WebSocketGateway(8080, { cors: { origin: '*' } })
export class CoreGateway {
  constructor(private readonly coreService: CoreService, private readonly prisma:  PrismaService) {}

  @WebSocketServer()
    server: Server;

  handleConnection(client: Socket){
    console.log(client.id)
  }

  @SubscribeMessage('message')
  async send(@MessageBody() message: WebSocketDto){
    let mes: string;
    if (!IsString(message["data"]["message"])){
      return null;
    } else {
      mes = message["data"]["message"]
    }
    try{
      let session = await this.coreService.getSessionBySessionID(message["data"]["session"]);
      // if (session.socketID != message["data"]["websocket"]){
      //   await this.prisma.session.update({
      //     where: {sessionID: message["data"]["session"]},
      //     data: {
      //       socketID: message["data"]["websocket"]
      //     }
      //   })
      // }
      let chat = await this.coreService.getChatBySession(session.sessionID);
      if (chat){
        let sessions = await this.coreService.getSessionsByChat(chat.id);
        if (sessions.length == 2){
          for (let ses of sessions){
            if (ses != session && ses.socketID != null){
              this.server.to(ses.socketID).emit("message", {message: mes})
              this.server.to(message["data"]["websocket"]).emit("message_is_sended", {message: mes})
              await this.coreService.createMessage({ text: mes, owner: session.sessionID, chatId: chat.id})
            }
          }
        }

      }
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
