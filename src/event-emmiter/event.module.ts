import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";

@Module({
    imports: [EventEmitterModule],
    providers: [EventService, EventEmitter2],
    exports: [EventService, EventEmitter2]
})
export class EventModule{}