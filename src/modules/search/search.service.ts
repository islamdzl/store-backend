import AppResponse, { ScreenMessageType } from "../../shared/app-response.js";
import Category from "../category/category.model.js";
import ProductModel from "../product/product.model.js";

export const findProducts: (keyWord: string, filter: Search.FindProductsFilter)=> Promise<Product[]> = async(keyWord, filter)=> {
  
  const sort:  any = {};
  const query: any = { isActive: true };

  if (keyWord) {
    query.$or = [
      { name: { $regex: keyWord, $options: 'i' } },
      { description: { $regex: keyWord, $options: 'i' } }
    ];
  }

  if (filter.sort) {
    if (filter.sort === 'BUY') sort.requests = -1
    if (filter.sort === 'HOT') sort.promo = -1
    if (filter.sort === 'NEW') sort.createdAt = -1
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
  .exec()

  return products;
}

export const related:(productId: ID, category?: ID)=> Promise<Product[]> = async(productId, category)=> {
  const product = await ProductModel.findById(productId)

  if (! product) {
    throw new AppResponse(404)
    .setScreenMessage('Product to related not found', ScreenMessageType.ERROR)
  }

  const searchText = `${product.name} ${product.description}`

  const query: any = {
    _id: { $ne: productId },
    isActive: true,
    $text: { $search: searchText }
  }

  if (category) {
    query['classification.category'] = category;
  }

  const projection = {
    name: 1,
    images: 1,
    price: 1,
    promo: 1,
    quantity: 1
  }

  const relatedProducts = await ProductModel.find(query, projection)
  .sort({ score: { $meta: 'textScore' } })
  .limit(10)
  .lean()
  .exec()

  return relatedProducts;
}