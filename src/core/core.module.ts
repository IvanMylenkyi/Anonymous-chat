import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreGateway } from './core.gateway';

@Module({
  providers: [CoreGateway, CoreService],
  controllers: [CoreController],
})
export class CoreModule {}
