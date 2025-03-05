import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CoreService } from 'src/core/core.service';
import { PrismaService } from 'src/prisma.service';
import { ChatController } from './chat.controller';

@Module({
    controllers: [ChatController],
    providers: [ChatService, PrismaService, CoreService],
    exports: [ChatService]
})
export class ChatModule {}