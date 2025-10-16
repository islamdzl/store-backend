import type { ClientSession } from 'mongoose'
import CartModel from './cart.model.js'
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';



export const addProduct: (userId: ID, cartItem: Cart.RequestAddItem, session?: ClientSession)=> Promise<Cart[]> = async(userId, cartItem, session)=> {
  const newCart = new CartModel({...cartItem, ownerId: userId})
  await newCart.save({session});
  
  return await getCart(userId)
}

export const removeProduct: (userId: ID, productId: ID, session?: ClientSession)=> Promise<Cart[]> = async(userId, productId, session)=> {
  const cartItem = await CartModel.findOneAndDelete({
    ownerId: userId,
    _id: productId
  })
  
  if (! cartItem) {
    throw new AppResponse(404)
    .setScreenMessage('Cart item not found', ScreenMessageType.ERROR)
  }
  return await getCart(userId)
}


export const getCart: (userId: ID)=> Promise<Cart[]> = async(userId)=> {
  return await CartModel.find({ownerId: userId})
  .lean()
  .exec()
}