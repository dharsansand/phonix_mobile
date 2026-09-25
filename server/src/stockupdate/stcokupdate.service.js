import {
  Injectable,
  NotFoundException,
  Dependencies,
  ConflictException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(getModelToken('StockUpdate'), getModelToken('Stock'))
export class StockUpdateService {
  constructor(stockUpdateModel, stockModel) {
    this.stockUpdateModel = stockUpdateModel;
    this.stockModel = stockModel;
  }

  async create(data) {
    // 1. Save the StockUpdate log
    const newStockUpdate = new this.stockUpdateModel(data);
    const savedStockUpdate = await newStockUpdate.save();

    // 2. Update the actual Stock collection
    if (data.stocks && Array.isArray(data.stocks)) {
      const bulkOps = data.stocks.map((item) => {
        // If 'add', add (+). If 'return', subtract (-).
        const change =
          item.actionType === 'return'
            ? -Math.abs(Number(item.changeQuantity)) // Subtract
            : Math.abs(Number(item.changeQuantity)); // Add

        const updateDoc = {
          $inc: { quantity: change },
        };

        // Update price using $set
        if (item.price !== undefined && item.price !== null) {
          updateDoc.$set = { price: Number(item.price) };
          updateDoc.$set = {
            ...updateDoc.$set,
            original_price: Number(item.original_price),
          };
        }

        return {
          updateOne: {
            filter: { _id: item.stockId },
            update: updateDoc,
          },
        };
      });

      if (bulkOps.length > 0) {
        await this.stockModel.bulkWrite(bulkOps);
      }
    }

    return savedStockUpdate;
  }
  async findAll() {
    return await this.stockUpdateModel
      .find({ isdelete: false })
      .populate([{ path: 'product', select: 'name' }])
      .sort({ createdAt: -1 });
  }

  async findOne(id) {
    const StockUpdate = await this.stockUpdateModel.findOne({
      _id: id,
      isdelete: false,
    });
    if (!StockUpdate) {
      throw new NotFoundException('StockUpdate not found');
    }
    return StockUpdate;
  }

  async update(id, updateData) {
    const updated = await this.stockUpdateModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
    );
    if (!updated) {
      throw new NotFoundException('StockUpdate not found');
    }
    return updated;
  }
}
