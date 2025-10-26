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

    const cartItem: Cart.AddItem = {
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

export const encrement: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try {
    const { error, value } = CartValidation.encrement(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.WARN)
    }

    await cartServise.encrement(user._id, value.cartItemId, /** session */)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller encrelent')
  }
}

export const decrement: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try {
    const { error, value } = CartValidation.decrement(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.WARN)
    }

    await cartServise.decrement(user._id, value.cartItemId, /** session */)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller decrement')
  }
}


