import { Injectable } from '@nestjs/common';

import * as argon from 'argon2';

import { UserDto, UserService } from 'src/user';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(data: UserDto) {
    const { password, username, email } = data;
    console.log(password);
    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
      description: data?.description,
    });

    return {
      user,
    };
  }

  async hashPassword(password: string) {
    return await argon.hash(password);
  }
}
