import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { Serializer } from 'src/interceptor';
import { AuthorDto, AuthorService, UserDto } from 'src/user';
import { AuthService } from './service';
import { AuthDto, DeleteResponseDto, ResponseDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly authorService: AuthorService,
  ) {}

  @Serializer(ResponseDto)
  @Post('/signup')
  async signUp(@Body() data: UserDto) {
    return this.authService.signUp(data);
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  // TODO: guarding to make sure author is made by admin
  @Serializer(ResponseDto)
  @Post('/createAuthor')
  @HttpCode(200)
  createAuthor(@Body() data: AuthorDto) {
    return this.authService.createAuthor(data);
  }

  @Serializer(DeleteResponseDto)
  @Delete('/deleteAuthor/:id')
  deleteAuthor(@Param('id') id: string) {
    return this.authorService.delete(parseInt(id));
  }

  @Patch('/updateAuthor/:id')
  updateAuthor(@Param('id') id: string, @Body() data: AuthorDto) {
    return this.authorService.update(parseInt(id), data);
  }
}
