import PurchaseModel from './purchase.model.js';
export const createMany = async (purchases, session) => {
    await Promise.allSettled(purchases.map((p) => new PurchaseModel(p).save({ session })));
};
export const getByDate = async (start, end, productId) => {
    const filter = {
        createdAt: {
            $gte: start,
            $lte: end,
        },
    };
    if (productId)
        filter.productId = productId;
    const purchases = await PurchaseModel.find(filter)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    return purchases;
};
//# sourceMappingURL=purchase.service.js.map