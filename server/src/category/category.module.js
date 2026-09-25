import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.schema.js';
import { CategoryService } from './category.service.js';
import { CategoryController } from './category.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema:CategorySchema  }])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
 
})
export class CategoryModule {}