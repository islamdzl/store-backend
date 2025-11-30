import type { ClientSession } from 'mongoose';
import PurchaseModel from './purchase.model.js';

export const createMany = async (purchases: Purchase.Create[], session?: ClientSession): Promise<void> => {
  await Promise.allSettled(
    purchases.map((p) => new PurchaseModel(p).save({ session }))
  );
};

export const getByDate = async (start: Date, end: Date, productId?: ID): Promise<Purchase[]> => {
  const filter: any = {
    createdAt: {
      $gte: start,
      $lte: end,
    },
  };

  if (productId) filter.productId = productId;

  const purchases = await PurchaseModel.find(filter)
    .sort({ createdAt: -1 })
    .lean<Purchase[]>()
    .exec();

  return purchases;
};
