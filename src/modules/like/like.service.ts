import LikeModel from './like.model.js';
import * as ProductService from '../product/product.service.js'
import type { ClientSession } from 'mongoose';
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';

export const getUser: (userId: ID)=> Promise<Like[]> = async(userId)=> {
  const likes = await LikeModel.find({userId})
  .sort({createdAt: -1})
  .populate('product')
  .lean()
  .exec()

  return likes;
}

export const create: (userId: ID, productId: ID, session?: ClientSession)=> Promise<void> = async(userId, productId, session)=> {
  const product = await ProductService.getProduct(productId, true);

  const newLike = new LikeModel({
    userId, product: productId
  })
  await newLike.save({session})
}

export const remove: (userId: ID, productId: ID, likeItemId: ID, session?: ClientSession)=> Promise<void> = async(userId, productId, likeItemId, session)=> {
  const like = await LikeModel.findOneAndDelete({
    userId, 
    $or: [
      {product: productId},
      {_id: likeItemId}
    ]
  }, {session})

  if (! like) {
    throw new AppResponse(404)
    .setScreenMessage('Like Item not found', ScreenMessageType.ERROR)
  }
}

export const ifLiked: (product: Product[] | Search.ProductResponse[], userId?: ID)=> Promise<Search.ProductResponse[]> = async(products, userId)=> {
  if (userId) {
    const likes = await LikeModel.find({userId})
    .lean()
    .exec()
    const cartProductsIds: ID[] = likes.map((l)=> l.product.toString())
    return products.map((p)=> cartProductsIds.includes(p._id.toJSON()) ? ({...p, liked: true}) : ({...p, liked: false}))
  }

  return products.map((p)=> ({...p, liked: false}))
}