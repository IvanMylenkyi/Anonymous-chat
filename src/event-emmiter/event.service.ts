import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";



@Injectable()
export class EventService{
    constructor(public eventEmmiter:EventEmitter2){}

    on(data:string, func: any){
        this.eventEmmiter.on(data, func);
    }

    emit(data:string){
        this.eventEmmiter.emit(data);
    }
}