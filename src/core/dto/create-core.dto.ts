import { IsBoolean, IsDate, IsInt, IsOptional, IsString,  } from "@nestjs/class-validator";


export class CreateCoreDto {
    @IsInt()
    id: number;

    @IsString()
    sessionID: string;

    @IsOptional()
    socketID: string;

    @IsDate()
    endTime: Date;

    @IsBoolean()
    status: boolean;




}
