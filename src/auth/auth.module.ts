import { Module } from '@nestjs/common';

import { UserModule } from 'src/user';
import { AuthController } from './auth.controller';
import { AuthService } from './service';

@Module({
  imports: [UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
