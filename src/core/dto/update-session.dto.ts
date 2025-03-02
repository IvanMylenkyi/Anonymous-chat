import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from '@nestjs/class-validator';
import { CreateSessionDto } from './create-session.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  id: number;
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

