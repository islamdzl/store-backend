import PurchaseModel from './purchase.model.js';
export const createMany = async (purchases, session) => {
    await Promise.allSettled(purchases.map((p) => new PurchaseModel(p).save({ session })));
};
export const getByDate = async (start, end, productId) => {
    const purchases = await PurchaseModel.find({
        productId,
        createdAt: {
            $gte: start,
            $lte: end
        }
    }, null, {
        sort: { createdAt: -1 }
    })
        .lean()
        .exec();
    return purchases;
};
//# sourceMappingURL=purchase.service.js.map