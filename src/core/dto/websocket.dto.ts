import { IsString, } from "@nestjs/class-validator";


export class WebSocketDto{
    @IsString()
    sessionID: string

    @IsString()
    websocketID: string

    @IsString()
    message: string
}