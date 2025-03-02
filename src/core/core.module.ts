import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreGateway } from './core.gateway';
import { CoreController } from './core.controller';

@Module({
  providers: [CoreGateway, CoreService],
  controllers: [CoreController],
})
export class CoreModule {}
