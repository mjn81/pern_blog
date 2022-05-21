import { Controller, Get, Post, Body } from '@nestjs/common';
import { Serializer } from 'src/interceptor';
import { UserDto } from 'src/user';
import { AuthService } from './service';
import { AuthDto, ResponseDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Serializer(ResponseDto)
  @Post('/signup')
  async signUp(@Body() data: UserDto) {
    return this.authService.signUp(data);
  }

  @Post('/signin')
  async signIn(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }
}
