import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  narrative!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  interactivity!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  originality!: number;
}
