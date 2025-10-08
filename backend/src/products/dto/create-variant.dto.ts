import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  sku?: string;
}

