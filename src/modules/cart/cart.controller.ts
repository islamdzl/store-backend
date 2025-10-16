import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from '../../shared/app-response.js';
import * as CartValidation from './cart.validate.js'
import * as cartServise from './cart.service.js'

export const get: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;

  try {

    const cart = await cartServise.getCart(user._id)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(cart)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller get')
  }
}

export const addProduct: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try {
    const { error, value } = CartValidation.addProduct(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.WARN)
    }

    const cartItem: Cart.RequestAddItem = {
      productId: value.productId,
      count: value.count,
    }

    const cart = await cartServise.addProduct(user._id, cartItem, /** session */)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(cart)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller addProduct')
  }
}

export const removeProduct: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try {
    const { error, value } = CartValidation.removeProduct(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.WARN)
    }

    const cart = await cartServise.removeProduct(user._id, value.productId, /** session */)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(cart)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller removeProduct')
  }
}

