import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { GlobalMiddlware } from './app.middware';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { SearchModule } from './search/search.module';
import { EventModule } from './event-emmiter/event.module';

@Module({
  imports: [CoreModule, ChatModule, SearchModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(GlobalMiddlware).forRoutes("*");
  }
}
