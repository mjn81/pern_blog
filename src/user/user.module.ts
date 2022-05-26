import { Module } from '@nestjs/common';
import { UserService } from './service';
import { UserController } from './user.controller';
import { AuthorService } from './service/author.service';
import { AdminService } from './service/admin.service';

@Module({
  providers: [UserService, AuthorService, AdminService],
  controllers: [UserController],
  exports: [UserService, AuthorService, AdminService],
})
export class UserModule {}
