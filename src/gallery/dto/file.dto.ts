import { IsString, IsOptional } from 'class-validator';

export class FileDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
