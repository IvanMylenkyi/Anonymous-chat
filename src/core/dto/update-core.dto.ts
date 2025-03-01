import { PartialType } from '@nestjs/mapped-types';
import { CreateCoreDto } from './create-core.dto';
import { IsBoolean, IsOptional } from '@nestjs/class-validator';

export class UpdateCoreDto extends PartialType(CreateCoreDto) {
  id: number;
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

