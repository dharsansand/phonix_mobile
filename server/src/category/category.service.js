import { Injectable, NotFoundException, Dependencies,ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(getModelToken('Category'))

export class CategoryService{
constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  
   async create(data) {
   
    const existingCategory = await this.categoryModel.findOne({ name: data.name });
    
    if (existingCategory) {
      throw new ConflictException(`Category with name "${data.name}" already exists`);
    }

    const newCategory = new this.categoryModel(data);
    return await newCategory.save();
  }
  async findAll() {
    return await this.categoryModel
      .find({ isdelete: false })
      .sort({ createdAt: -1 });
  }

  async findOne(id) {
    const Category = await this.categoryModel.findOne({ _id: id, isdelete: false });
    if (!Category) {
      throw new NotFoundException('Category not found');
    }
    return Category;
  }

  async update(id, updateData) {
    const updated = await this.categoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    return updated;
  }


  async delete(id) {
    const deleted = await this.categoryModel.findByIdAndUpdate(
      id,
      { isdelete: true },
      { new: true }
    );
    if (!deleted) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }




}