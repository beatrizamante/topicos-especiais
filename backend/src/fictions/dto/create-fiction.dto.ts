import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateFictionDto {
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  title!: string;

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
  @IsNotEmpty()
  link!: string;
}
