import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user';
import { AuthController } from './auth.controller';
import { AuthService, TokenService } from './service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [UserModule, JwtModule.register({})],
  providers: [AuthService, TokenService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
