import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createToken(pk: number, email: string) {
    try {
      const token = this.jwtService.sign(
        {
          id: pk,
          email,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
        },
      );
      const refreshToken = this.jwtService.sign(
        {
          id: pk,
          email,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        },
      );
      return {
        access_token: token,
        refresh_toke: refreshToken,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async verifyToken(token: string) {
    return this.jwtService.verify(token, this.configService.get('JWT_SECRET'));
  }

  private async verifyRefreshToken(rtoken: string) {
    return this.jwtService.verify(
      rtoken,
      this.configService.get('JWT_REFRESH_SECRET'),
    );
  }

  async generateNewToken(rtoken: string) {
    const verify = await this.verifyRefreshToken(rtoken);
    if (!verify) {
      throw new ForbiddenException('refresh token is expired');
    }
    const { id, email } = verify;
    return this.jwtService.sign(
      { id, email },
      { secret: this.configService.get('JWT_SECRET') },
    );
  }
}
