import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user';
import { AuthController } from './auth.controller';
import { AuthService, TokenService } from './service';

@Module({
  imports: [UserModule, JwtModule],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
