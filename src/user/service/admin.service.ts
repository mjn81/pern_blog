import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { AuthorDto } from '../dto';
import { UserService } from './user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createAdmin(data: AuthorDto) {
    const { user, birthdate } = data;
    const hashPassword = await this.userService.hashPassword(user.password);
    delete data.user, data.birthdate, user.password;
    return this.prismaService.admin.create({
      data: {
        author: {
          create: {
            ...data,
            birthdate: new Date(birthdate),
            user: {
              create: {
                ...user,
                password: hashPassword,
              },
            },
          },
        },
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findByUserId(id: number) {
    return this.prismaService.admin.findFirst({
      where: {
        author: {
          user: {
            id,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prismaService.admin.findMany({
      include: {
        author: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: AuthorDto) {
    const { user, birthdate } = data;
    const hashPassword = await this.userService.hashPassword(user.password);
    delete data.user, data.birthdate, user.password;
    return this.prismaService.admin.update({
      where: {
        id,
      },
      data: {
        author: {
          update: {
            first_name: data.first_name,
            last_name: data.last_name,
            card_code: data.card_code,
            address: data.address,

            birthdate: new Date(birthdate),
            user: {
              update: {
                ...user,
                password: hashPassword,
              },
            },
          },
        },
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
