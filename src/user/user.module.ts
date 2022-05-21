import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { UserService } from './service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
