import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
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
    private readonly user: UserService,
    private readonly author: AuthorService,
    private readonly admin: AdminService,
    private readonly token: TokenService,
  ) {}

  async signUp(data: UserDto) {
    const user = await this.user.createUser(data);
    const auth = await this.token.createToken(user.id, user.email);
    return {
      role: UserRole.USER,
      ...user,
      ...auth,
    };
  }

  async signIn(data: AuthDto) {
    const { email, password } = data;
    let role: UserRole = UserRole.USER;
    const user = await this.user.findByEmail(email);
    if (!user) {
      throw new NotFoundException("such user doesn't exist");
    }
    const verify = await argon.verify(user.password, password);
    if (!verify) {
      throw new UnauthorizedException('password is not correct');
    }
    const auth = await this.token.createToken(user.id, user.email);

    const author = await this.author.findByUserId(user.id);
    if (!!author) {
      role = UserRole.AUTHOR;
    }

    const admin = await this.admin.findByUserId(user.id);
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
    const user = await this.user.findByEmail(email);
    if (user) {
      throw new BadRequestException('this user already exists');
    }
    let sUser = null;
    let auth = null;
    if (role === UserRole.AUTHOR) {
      sUser = await this.author.createAuthor(data);
      auth = this.token.createToken(sUser.id, sUser.email);
    } else if (role === UserRole.ADMIN) {
      sUser = await this.admin.createAdmin(data);
      auth = await this.token.createToken(sUser.id, sUser.author.user.email);
    }
    return {
      role,
      ...sUser,
      ...auth,
    };
  }

  async updateSuperUser(id: number, data: AuthorDto, role: UserRole) {
    const { email } = data.user;
    const user = await this.user.findByEmail(email);
    if (!user) {
      throw new BadRequestException("this user doesn't exist");
    }

    if (role === UserRole.AUTHOR) {
      const author = await this.author.update(id, data);
      const auth = await this.token.createToken(author.id, author.user.email);
      return {
        ...author,
        ...auth,
      };
    }
    if (role === UserRole.ADMIN) {
      const admin = await this.admin.update(id, data);
      const auth = await this.token.createToken(
        admin.id,
        admin.author.user.email,
      );
      return {
        ...admin,
        ...auth,
      };
    }

    throw new BadRequestException('invalid request');
  }

  async delete(id: number) {
    const user = await this.user.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return this.user.deleteUser(id);
  }
}
