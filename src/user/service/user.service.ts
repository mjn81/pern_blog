import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: UserDto) {
    const user = await this.findByEmail(data.email);
    if (!!user) {
      throw new ConflictException('a user with this email already exists');
    }
    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateUser(id: number, data: UserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByUsername(username: string) {
    return this.prisma.user.findMany({ where: { username } });
  }
}
