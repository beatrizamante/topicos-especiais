import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  @IsEmail()
  @IsOptional()
  email?: string;
}
