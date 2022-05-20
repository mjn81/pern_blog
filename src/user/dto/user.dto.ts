import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  birthDate: string;
}
