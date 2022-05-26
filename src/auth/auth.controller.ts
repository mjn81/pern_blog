import {
  Controller,
  Post,
  Body,
  HttpCode,
  Delete,
  Param,
  Patch,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Serializer } from 'src/interceptor';
import { AuthorDto, AuthorService, AdminService, UserDto } from 'src/user';
import { AuthService } from './service';
import { AuthDto, DeleteResponseDto, ResponseDto } from './dto';
import { UserRole } from 'src/constants';
import { AdminGuard, AuthorGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authorService: AuthorService,
    private readonly adminService: AdminService,
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

  @UseGuards(AdminGuard)
  @Serializer(DeleteResponseDto)
  @Delete('/delete/:id')
  deleteAuthor(@Param('id') id: string) {
    return this.authService.delete(parseInt(id));
  }

  @UseGuards(AuthorGuard)
  @Serializer(ResponseDto)
  @Post('/createAuthor')
  @HttpCode(200)
  createAuthor(@Body() data: AuthorDto) {
    return this.authService.createSuperUser(data, UserRole.AUTHOR);
  }

  @Patch('/updateAuthor/:id')
  updateAuthor(@Param('id') id: string, @Body() data: AuthorDto) {
    return this.authorService.update(parseInt(id), data);
  }

  @UseGuards(AdminGuard)
  @Serializer(ResponseDto)
  @Post('/createAdmin')
  createAdmin(@Body() data: AuthorDto) {
    return this.authService.createSuperUser(data, UserRole.ADMIN);
  }

  @UseGuards(AdminGuard)
  @Patch('/updateAdmin/:id')
  updateAdmin(@Param('id') id: string, @Body() data: AuthorDto) {
    return this.adminService.update(parseInt(id), data);
  }
}
