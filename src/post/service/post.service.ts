import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  // async addPost() {
  //     return
  // }
}
