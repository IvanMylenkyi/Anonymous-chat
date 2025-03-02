import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CoreService } from './core.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';


@WebSocketGateway()
export class CoreGateway {
  constructor(private readonly coreService: CoreService) {}
}
//   @SubscribeMessage('createCore')
//   create(@MessageBody() createSessionDto: CreateSessionDto) {
//     return this.coreService.create(createSessionDto);
//   }

//   @SubscribeMessage('findAllCore')
//   findAll() {
//     return this.coreService.findAll();
//   }

//   @SubscribeMessage('findOneCore')
//   findOne(@MessageBody() id: number) {
//     return this.coreService.findOne(id);
//   }

//   @SubscribeMessage('updateCore')
//   update(@MessageBody() updateSessionDto: UpdateSessionDto) {
//     return this.coreService.update(updateSessionDto.id, updateSessionDto);
//   }

//   @SubscribeMessage('removeCore')
//   remove(@MessageBody() id: number) {
//     return this.coreService.remove(id);
//   }
// }
