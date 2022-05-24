import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { UserDto } from './user.dto';

export class AuthorDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  card_code: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate: string;

  @Type(() => UserDto)
  @ValidateNested()
  user: UserDto;
}
