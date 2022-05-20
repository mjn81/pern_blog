import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  signUp(data: UserDto) {
    return this.userService.createUser(data);
  }
}
