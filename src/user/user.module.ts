import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { UserService, AuthService } from './service';

@Module({
  providers: [UserService, AuthService],
  imports: [PrismaModule],
})
export class UserModule {}
