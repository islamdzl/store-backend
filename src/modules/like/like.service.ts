import LikeModel from './like.model.js';
import * as ProductService from '../product/product.service.js'
import type { ClientSession } from 'mongoose';
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';

export const getUser: (userId: ID)=> Promise<Like[]> = async(userId)=> {
  const likes = await LikeModel.find({userId})
  .sort({createdAt: -1})
  .lean()
  .exec()

  return likes;
}

export const create: (userId: ID, productId: ID, session?: ClientSession)=> Promise<void> = async(userId, productId, session)=> {
  const product = await ProductService.getProduct(productId);

  const newLike = new LikeModel({
    preview: product!.images[0],
    userId, productId
  })
  await newLike.save({session})
}

export const remove: (userId: ID, productId: ID, session?: ClientSession)=> Promise<void> = async(userId, productId, session)=> {
  const like = await LikeModel.findByIdAndDelete({userId, productId}, {session})

  if (! like) {
    throw new AppResponse(404)
    .setScreenMessage('Like Item not found', ScreenMessageType.ERROR)
  }
}

