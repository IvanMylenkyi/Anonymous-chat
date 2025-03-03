import { IsInt, IsString} from "@nestjs/class-validator";

export class CreateMessageDto{
    @IsString()
    text:string
    
    @IsString()
    owner: string
    
    @IsInt()
    chatId:number

}