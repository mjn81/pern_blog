import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { PostService } from './service/post.service';
import { PostController } from './post.controller';

@Module({
  imports: [PrismaModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
