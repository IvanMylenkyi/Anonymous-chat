import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CoreService } from './core.service';
import { CreateCoreDto } from './dto/create-core.dto';
import { UpdateCoreDto } from './dto/update-core.dto';

@WebSocketGateway()
export class CoreGateway {
  constructor(private readonly coreService: CoreService) {}

  @SubscribeMessage('createCore')
  create(@MessageBody() createCoreDto: CreateCoreDto) {
    return this.coreService.create(createCoreDto);
  }

  @SubscribeMessage('findAllCore')
  findAll() {
    return this.coreService.findAll();
  }

  @SubscribeMessage('findOneCore')
  findOne(@MessageBody() id: number) {
    return this.coreService.findOne(id);
  }

  @SubscribeMessage('updateCore')
  update(@MessageBody() updateCoreDto: UpdateCoreDto) {
    return this.coreService.update(updateCoreDto.id, updateCoreDto);
  }

  @SubscribeMessage('removeCore')
  remove(@MessageBody() id: number) {
    return this.coreService.remove(id);
  }
}
