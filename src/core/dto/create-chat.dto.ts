import { IsOptional, IsString, } from "@nestjs/class-validator";


export class CreateChatDto {
    @IsString()
    sessionID1: string;
    @IsString()
    sessionID2: string;
}