import { Module } from '@nestjs/common';
import { GalleryService } from './service';
import { GalleryController } from './gallery.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: 'public/uploads',
    }),
  ],
  providers: [GalleryService],
  controllers: [GalleryController],
})
export class GalleryModule {}
