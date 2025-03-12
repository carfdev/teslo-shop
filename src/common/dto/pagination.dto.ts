import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset?: number;
}
