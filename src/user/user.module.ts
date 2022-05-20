import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { UserService } from './service';

@Module({
  providers: [UserService],
  imports: [PrismaModule],
})
export class UserModule {}
