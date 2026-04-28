import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateFictionDto {
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @IsOptional()
  title?: string;

  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @IsOptional()
  genre?: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  publishedAt?: number;

  @IsString()
  @IsOptional()
  link?: string;
}
