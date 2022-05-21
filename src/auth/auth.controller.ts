import { Controller, Get, Post, Body } from '@nestjs/common';
import { Serializer } from 'src/interceptor';
import { UserDto } from 'src/user';
import { AuthService } from './service';
import { ResponseDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Serializer(ResponseDto)
  @Get('/signup')
  async signUp(@Body() data: UserDto) {
    return this.authService.signUp(data);
  }
}
