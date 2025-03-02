import { IsOptional, IsString, } from "@nestjs/class-validator";


export class CreateSessionDto {
    @IsString()
    sessionID: string;

    @IsOptional()
    @IsString()
    socketID?: string;




}
