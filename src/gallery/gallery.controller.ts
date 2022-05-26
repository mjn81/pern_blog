import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { of } from 'rxjs';
import { AuthorGuard } from 'src/auth/guard';
import { UserRole } from 'src/constants';
import { User } from 'src/decorator';
import { FileDto } from './dto';
import { GalleryService } from './service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly gallery: GalleryService) {}

  @UseGuards(AuthorGuard)
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(
            new HttpException('Invalid file type', HttpStatus.NOT_ACCEPTABLE),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileDto,
    @User() user,
  ) {
    let image = null;
    if (user.role === UserRole.ADMIN) {
      image = await this.gallery.uploadFile(
        file.filename,
        body,
        user.user.author.id,
      );
    }
    if (user.role === UserRole.AUTHOR) {
      image = await this.gallery.uploadFile(file.filename, body, user.user.id);
    }
    if (!image) throw new InternalServerErrorException('image not accepted');
    return { status: 'success', image };
  }

  @Get('/images/:id')
  async getImage(@Param('id') id: string, @Res() res) {
    const image = await this.gallery.getFile(parseInt(id));
    return of(
      res.sendFile(join(process.cwd(), 'public', 'uploads', image.image)),
    );
  }

  @UseGuards(AuthorGuard)
  @Delete('/delete/:id')
  deleteImage(@Param('id') id: string) {
    return this.gallery.deleteFile(parseInt(id));
  }
}
