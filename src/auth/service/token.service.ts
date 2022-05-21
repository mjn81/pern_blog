import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/prisma';

@Injectable()
export class TokenService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async createToken(pk: number, email: string) {
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

    this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
      },
    });
    return {
      token,
      refreshToken,
    };
  }
}
