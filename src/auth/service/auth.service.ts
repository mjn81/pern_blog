import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { UserDto, AuthorDto, UserService, AuthorService } from 'src/user';
import { AuthDto } from '../dto';
import { TokenService } from './token.service';
import { UserRole } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authorService: AuthorService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(data: UserDto) {
    const user = await this.userService.createUser(data);
    const auth = await this.tokenService.createToken(user.id, user.email);
    return {
      role: UserRole.USER,
      ...user,
      ...auth,
    };
  }

  async signIn(data: AuthDto) {
    const { email, password } = data;
    let role: UserRole = UserRole.USER;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("such user doesn't exist");
    }
    const isAuthor = this.authorService.findByUserId(user.id);
    if (!!isAuthor) {
      role = UserRole.Author;
    }
    const verify = await argon.verify(user.password, password);
    if (!verify) {
      throw new UnauthorizedException('password is not correct');
    }
    const auth = await this.tokenService.createToken(user.id, user.email);
    return {
      role,
      ...auth,
    };
  }

  async createAuthor(data: AuthorDto) {
    const { email } = data.user;
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestException('this user already exists');
    }
    const author = await this.authorService.createAuthor(data);
    const auth = await this.tokenService.createToken(
      author.id,
      author.user.email,
    );
    return {
      ...author,
      ...auth,
    };
  }

  async findAll() {
    return this.authorService.findAll();
  }

  async findOne(id: number) {
    return this.authorService.findOne(id);
  }

  async findByUserId(userId: number) {
    return this.authorService.findByUserId(userId);
  }

  async update(id: number, data: AuthorDto) {
    const { email } = data.user;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("this user doesn't exist");
    }
    const author = await this.authorService.update(id, data);
    const auth = await this.tokenService.createToken(
      author.id,
      author.user.email,
    );
    return {
      ...author,
      ...auth,
    };
  }

  async delete(id: number) {
    const author = await this.authorService.findOne(id);
    if (!author) {
      throw new NotFoundException("this author doesn't exist");
    }
    await this.authorService.delete(id);
    return {
      ...author,
      message: 'author and user deleted',
    };
  }
}
