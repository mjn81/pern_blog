import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon from 'argon2';

import {
  UserDto,
  AuthorDto,
  UserService,
  AuthorService,
  AdminService,
} from 'src/user';
import { AuthDto } from '../dto';
import { TokenService } from './token.service';
import { UserRole } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authorService: AuthorService,
    private readonly adminService: AdminService,
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
    const verify = await argon.verify(user.password, password);
    if (!verify) {
      throw new UnauthorizedException('password is not correct');
    }
    const auth = await this.tokenService.createToken(user.id, user.email);

    const author = await this.authorService.findByUserId(user.id);
    if (!!author) {
      role = UserRole.Author;
    }

    const admin = await this.adminService.findByUserId(user.id);
    if (!!admin) {
      role = UserRole.ADMIN;
    }

    return {
      role,
      ...auth,
    };
  }

  async createSuperUser(data: AuthorDto, role: UserRole) {
    const { email } = data.user;
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestException('this user already exists');
    }
    let sUser = null;
    let auth = null;
    if (role === UserRole.Author) {
      sUser = await this.authorService.createAuthor(data);
      auth = this.tokenService.createToken(sUser.id, sUser.email);
    } else if (role === UserRole.ADMIN) {
      sUser = await this.adminService.createAdmin(data);
      auth = await this.tokenService.createToken(
        sUser.id,
        sUser.author.user.email,
      );
    }
    return {
      role,
      ...sUser,
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
