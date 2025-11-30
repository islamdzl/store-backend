import * as PurchaseService from '../purchase/purchase.service.js';
export const getSellData = async (data) => {
    let days = 1000 * 60 * 60 * 24;
    if (data.date === 'MONTH')
        days = days * 30;
    if (data.date === 'YEAR')
        days = days * 360;
    const startDate = new Date();
    const endDate = new Date(Date.now() - days);
    const purchases = await PurchaseService.getByDate(new Date(startDate.getTime() - days * data.skip), new Date(endDate.getTime() - days * data.skip), data.productId);
    const result = {
        data: purchases.map((p) => ({
            productId: p.productId,
            count: p.count,
        })),
        allProducts: purchases.reduce((value, p) => value += p.count, 0),
        skip: data.skip,
        date: data.date
    };
    return result;
};
export const getProfitData = async (data) => {
    let days = 1000 * 60 * 60 * 24;
    if (data.date === 'MONTH')
        days = days * 30;
    if (data.date === 'YEAR')
        days = days * 360;
    const startDate = new Date();
    const endDate = new Date(Date.now() - days);
    const purchases = await PurchaseService.getByDate(new Date(startDate.getTime() - days * data.skip), new Date(endDate.getTime() - days * data.skip), data.productId);
    const result = {
        data: purchases.map((p) => ({
            deliveryPrice: p.deliveryPrice,
            productsPrice: p.productPrice,
            totalPrice: p.productPrice * p.count
        })),
        skip: data.skip,
        date: data.date
    };
    return result;
};
//# sourceMappingURL=analyzing.service.js.map