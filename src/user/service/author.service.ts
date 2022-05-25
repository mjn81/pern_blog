import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { AuthorDto } from '../dto';
import { UserService } from './user.service';

@Injectable()
export class AuthorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createAuthor(data: AuthorDto) {
    const { user, birthdate } = data;
    delete data.user, data.birthdate;
    const hashedPassword = await this.userService.hashPassword(user.password);
    delete user.password;
    return this.prismaService.author.create({
      data: {
        ...data,
        birthdate: new Date(birthdate),
        user: {
          connectOrCreate: {
            create: {
              ...user,
              password: hashedPassword,
            },
            where: {
              email: user.email,
            },
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.author.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prismaService.author.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(id: number) {
    return this.prismaService.author.findFirst({
      where: {
        user: {
          id,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, data: AuthorDto) {
    const { user } = data;
    const hashPassword = await this.userService.hashPassword(user.password);
    delete user.password;
    return this.prismaService.author.update({
      where: {
        id,
      },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        card_code: data.card_code,
        address: data.address,
        birthdate: new Date(data.birthdate),
        user: {
          update: {
            ...user,
            password: hashPassword,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async delete(id: number) {
    const author = await this.findOne(id);
    if (!author) {
      throw new NotFoundException("this author doesn't exist");
    }

    return this.prismaService.user.delete({
      where: {
        id: author.user.id,
      },
    });
  }
}
