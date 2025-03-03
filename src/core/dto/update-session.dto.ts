import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, isString } from '@nestjs/class-validator';
import { CreateSessionDto } from './create-session.dto';
import { IsIn, IsInt, IsString } from 'class-validator';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @IsInt()
  id: number;

  @IsString()
  sessionID:string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

