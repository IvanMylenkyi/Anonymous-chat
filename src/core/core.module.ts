import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreGateway } from './core.gateway';
import { CoreController } from './core.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  // imports:[PrismaService],
  providers: [CoreGateway, CoreService, PrismaService],
  controllers: [CoreController],
})
export class CoreModule {}
