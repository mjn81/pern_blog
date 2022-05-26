import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { unlink } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma';
import { FileDto } from '../dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  uploadFile(fileName: string, data: FileDto, authorId: number) {
    return this.prisma.gallery.create({
      data: {
        ...data,
        image: fileName,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  getFile(id: number) {
    return this.prisma.gallery.findUnique({ where: { id } });
  }

  async deleteFile(id: number) {
    const image = await this.prisma.gallery.delete({
      where: {
        id,
      },
    });

    await unlink(
      join(process.cwd(), 'public', 'uploads', image.image),
      (err) => {
        if (!err) throw new InternalServerErrorException(err.message);
      },
    );

    return image;
  }
}
