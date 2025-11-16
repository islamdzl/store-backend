import ProductModel from "../product/product.model.js";
export const findProducts = async (keyWord, filter) => {
    const sort = {};
    const query = { isActive: true };
    if (keyWord) {
        query.$or = [
            { name: { $regex: keyWord, $options: 'i' } },
            { description: { $regex: keyWord, $options: 'i' } }
        ];
    }
    if (filter.sort) {
        if (filter.sort === 'BUY')
            sort.requests = -1;
        if (filter.sort === 'HOT')
            sort.promo = -1;
        if (filter.sort === 'NEW')
            sort.createdAt = -1;
    }
    if (filter.classification) {
        query['classification.category'] = filter.classification.category;
        if (filter.classification.branch) {
            query['classification.branch'] = filter.classification.branch;
        }
    }
    const products = await ProductModel.find(query, {
        keyVal: 0,
        delivery: 0,
        description: 0,
    })
        .limit(Math.min(filter.limit, 100))
        .skip(filter.skip)
        .sort(sort)
        .lean()
        .exec();
    return products;
};
//# sourceMappingURL=search.service.js.map