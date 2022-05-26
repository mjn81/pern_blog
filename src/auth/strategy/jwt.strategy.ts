import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/constants';
import { AdminService, AuthorService, UserService } from 'src/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly config: ConfigService,
    private readonly user: UserService,
    private readonly author: AuthorService,
    private readonly admin: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id } = payload;
    let user: any = await this.user.findOne(id);
    if (!user) return false;
    let role: UserRole = UserRole.USER;
    const author = await this.author.findByUserId(id);
    if (!!author) {
      role = UserRole.AUTHOR;
      user = author;
    }
    const admin = await this.admin.findByUserId(id);
    if (!!admin) {
      role = UserRole.ADMIN;
      user = admin;
    }
    return { role, user };
  }
}
