import type { ClientSession } from 'mongoose'
import CartModel from './cart.model.js'
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';



export const addProduct: (userId: ID, cartItem: Cart.AddItem, session?: ClientSession)=> Promise<Cart[]> = async(userId, cartItem, session)=> {
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

export const ifCartHas: (product: Product[], userId?: ID)=> Promise<Search.ProductResponse[]> = async(products, userId)=> {
  if (userId) {
    const cart = await getCart(userId);
    const cartProductsIds: ID[] = cart.map((p)=> p.productId.toString())
    return products.map((p)=> cartProductsIds.includes(p._id.toJSON()) ? ({...p, inCart: true}) : ({...p, inCart: false}))
  }

  return products.map((p)=> ({...p, inCart: false}))
}

export const encrement: (userId: ID, cartItemId: ID, session?: ClientSession)=> Promise<void> = async(userId, cartItemId, session)=> {
  const cartItem = await CartModel.findOneAndUpdate({
    ownerId: userId, _id: cartItemId
  }, {
    $inc: {
      count: 1
    }
  }, { session })

  if (! cartItem) {
    throw new AppResponse(404)
    .setScreenMessage('Cart Item not found', ScreenMessageType.ERROR)
  }
}

export const decrement: (userId: ID, cartItemId: ID, session?: ClientSession)=> Promise<void> = async(userId, cartItemId, session)=> {
  const cartItem = await CartModel.findOneAndUpdate({
    ownerId: userId, _id: cartItemId
  }, {
    $inc: {
      count: -1
    }
  }, { session })

  if (! cartItem) {
    throw new AppResponse(404)
    .setScreenMessage('Cart Item not found', ScreenMessageType.ERROR)
  }
}