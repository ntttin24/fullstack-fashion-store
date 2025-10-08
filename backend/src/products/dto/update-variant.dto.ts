import { IsOptional, IsInt, Min } from 'class-validator';

export class UpdateVariantDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;
}

