import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/constants';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    const { role } = user;
    if (role !== UserRole.ADMIN)
      throw new UnauthorizedException(
        'user doesnt have sufficient permissions',
      );
    return user;
  }
}
