import { Module } from '@nestjs/common';
import { GalleryService } from './service';

@Module({
  providers: [GalleryService],
})
export class GalleryModule {}
