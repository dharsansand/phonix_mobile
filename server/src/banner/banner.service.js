import { Injectable, NotFoundException, Dependencies } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(getModelToken('Banner'))
export class BannerService {
  constructor(bannerModel) {
    this.bannerModel = bannerModel;
  }

  async create(data) {
    const newBanner = new this.bannerModel(data);
    return await newBanner.save();
  }

  async findAll() {
    return await this.bannerModel
      .find({ isdelete: false })
      .sort({ createdAt: -1 });
  }
  async findFontBanner() {
    return await this.bannerModel
      .find({ isdelete: false, Active: true })
      .sort({ createdAt: -1 });
  }

  async findOne(id) {
    const banner = await this.bannerModel.findOne({ _id: id, isdelete: false });
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return banner;
  }

  async update(id, updateData) {
    const updated = await this.bannerModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Banner not found');
    }
    return updated;
  }

  async delete(id) {
    const deleted = await this.bannerModel.findByIdAndUpdate(
      id,
      { isdelete: true },
      { new: true },
    );
    if (!deleted) {
      throw new NotFoundException('Banner not found');
    }
    return { message: 'Banner deleted successfully' };
  }

  async toggleActive(id, Active) {
    const updated = await this.bannerModel.findByIdAndUpdate(
      id,
      { Active },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Banner not found');
    }
    return updated;
  }
}
