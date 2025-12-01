import * as PurchaseService from '../purchase/purchase.service.js';
const getTime = (date) => {
    const DAY = 1000 * 60 * 60 * 24;
    let Loops = 0;
    let Time = 0;
    switch (date) {
        case 'MONTH':
            Time = DAY;
            Loops = 30;
            break;
        case 'YEAR':
            Time = DAY * 30;
            Loops = 12;
            break;
        case 'DAY':
            Time = 1000 * 60 * 60;
            Loops = 24;
            break;
    }
    return { Time, Loops };
};
export const getSellData = async (data) => {
    const { Time, Loops } = getTime(data.date);
    const ET = new Date(Date.now()).setHours(0, 0, 0, 0);
    const ST = new Date(ET - (Time * Loops)).getTime();
    const purchases = await PurchaseService.getByDate(new Date(ST), new Date(ET), data.productId);
    let sell = [];
    while (sell.length < Loops)
        sell.push({
            count: 0,
            products: [],
        });
    purchases.forEach((p) => {
        const from = new Date(p.createdAt).getTime();
        const index = Math.floor((from - ST) / Time) % Loops;
        if (index >= 0 && index < Loops) {
            sell[index].count += p.count;
            sell[index].products.push({
                count: p.count,
                productId: p.productId
            });
        }
    });
    const result = {
        data: sell,
        allProducts: purchases.reduce((value, p) => value += p.count, 0),
        skip: data.skip,
        date: data.date
    };
    return result;
};
export const getProfitData = async (data) => {
    let { Time, Loops } = getTime(data.date);
    const ET = new Date(Date.now()).setHours(0, 0, 0, 0);
    const ST = new Date(ET - (Time * Loops)).getTime();
    const purchases = await PurchaseService.getByDate(new Date(ST), new Date(ET), data.productId);
    const profite = [];
    while (profite.length < Loops)
        profite.push({
            deliveryPrice: 0,
            productsPrice: 0,
            totalPrice: 0,
        });
    purchases.forEach((p) => {
        const from = new Date(p.createdAt).getTime();
        const index = Math.floor((from - ST) / Time) % Loops;
        if (index >= 0 && index < Loops) {
            profite[index].deliveryPrice += p.deliveryPrice;
            profite[index].productsPrice += p.productPrice;
            profite[index].totalPrice += (p.productPrice * p.count);
        }
    });
    const result = {
        data: profite,
        date: data.date,
        skip: data.skip
    };
    return result;
};
export const genral = async () => {
    return {};
};
//# sourceMappingURL=analyzing.service.js.map