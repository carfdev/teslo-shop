import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    minimum: 1,
    default: 10,
    description: 'How many records do you want to load',
    required: false,
  })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many records do you want to skip',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset?: number;
}
