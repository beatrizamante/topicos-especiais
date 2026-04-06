import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  narrative?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  interactivity?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  originality?: number;
}
