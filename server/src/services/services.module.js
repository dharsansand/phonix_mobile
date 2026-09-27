import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ServiceController } from './services.controller';
import { ServiceService } from './services.service';
import { ServiceSchema } from './services.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Service', schema: ServiceSchema }]),
    CloudinaryModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
