import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateAuthorDto {
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsIn(['main_author', 'coauthor', 'collaborator'])
  role!: string;
}
