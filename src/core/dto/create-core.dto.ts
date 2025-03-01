import { IsOptional, IsString, } from "@nestjs/class-validator";


export class CreateCoreDto {
    @IsString()
    sessionID: string;

    @IsOptional()
    @IsString()
    socketID?: string;




}
