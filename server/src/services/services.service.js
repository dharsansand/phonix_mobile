import {
  Injectable,
  NotFoundException,
  ConflictException,
  Dependencies,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(getModelToken('Service'))
export class ServiceService {
  constructor(serviceModel) {
    this.serviceModel = serviceModel;
  }

  // 🟢 1. Create Service
  async create(createDto) {
    const existing = await this.serviceModel.findOne({
      slug: createDto.slug,
      isDelete: false,
    });
    if (existing) {
      throw new ConflictException('A service with this slug already exists');
    }

    const newService = new this.serviceModel(createDto);
    return await newService.save();
  }

  // 🟢 2. Find All Services
  async findAll() {
    return await this.serviceModel
      .find({ isDelete: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  // 🟢 3. Find by Slug or MongoDB ID
  async findOneBySlugOrId(identifier) {
    let service = null;

    if (identifier && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      service = await this.serviceModel.findOne({
        _id: identifier,
        isDelete: false,
      });
    }

    if (!service) {
      service = await this.serviceModel.findOne({
        slug: identifier.toLowerCase(),
        isDelete: false,
      });
    }

    if (!service) {
      throw new NotFoundException('Service repair case not found');
    }

    return service;
  }

  // 🟢 4. Update Service
  async update(id, updateDto) {
    const updated = await this.serviceModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Service not found');
    }

    return updated;
  }

  // 🟢 5. Soft Delete
  async remove(id) {
    const deleted = await this.serviceModel.findByIdAndUpdate(
      id,
      { $set: { isDelete: true } },
      { new: true },
    );

    if (!deleted) {
      throw new NotFoundException('Service not found');
    }

    return { message: 'Service repair case deleted successfully' };
  }
}
