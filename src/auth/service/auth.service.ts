import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { UserDto, UserService } from 'src/user';
import { AuthDto } from '../dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(data: UserDto) {
    const { password, username, email } = data;
    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
      description: data?.description,
    });
    const auth = await this.tokenService.createToken(user.id, user.email);
    return {
      ...user,
      ...auth,
    };
  }

  private async hashPassword(password: string) {
    return await argon.hash(password);
  }

  async signIn(data: AuthDto) {
    const { email, password } = data;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("such user doesn't exist");
    }
    const verify = await argon.verify(user.password, password);
    if (!verify) {
      throw new UnauthorizedException('password is not correct');
    }
    const auth = await this.tokenService.createToken(user.id, user.email);
    return {
      ...auth,
    };
  }
}
