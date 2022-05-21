import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { UserDto, UserService } from 'src/user';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUp(data: UserDto) {
    const { password, username, email } = data;
    console.log(password);
    const hashedPassword = await this.hashPassword(password);
    return this.userService.createUser({
      username,
      email,
      password: hashedPassword,
      description: data?.description,
    });
  }

  async hashPassword(password: string) {
    return await argon.hash(password);
  }
}
