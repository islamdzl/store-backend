import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from '../../shared/app-response.js';
import * as CartValidation from './cart.validate.js'
import * as CartService from './cart.service.js'
import * as ProductService from '../product/product.service.js'
import * as Services from '../../shared/services.js'
import * as OrderService from '../order/order.service.js'
import Track from '../pixel/index.js';
import type { HydratedDocument } from 'mongoose';

export const get: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;

  try {

    const cart = await CartService.getCart(user._id)
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
      product: value.productId!,
      count: value.count,
    }
    Track("CART_ADD" as Pixle.Events)
    const cart = await CartService.addProduct(user._id, cartItem, /** session */)
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

    Track("CART_REMOVE" as Pixle.Events)
    const cart = await CartService.removeProduct(user._id, value.productId, value.cartItemId, /** session */)
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

    const cartItem = await Services.withSession(async(session)=> {
      return await CartService.encrement(user._id, value.cartItemId, session)
    })
    
    useAppResponse(res, 
      new AppResponse(200)
      .setData(cartItem)
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

    const cartItem = await Services.withSession(async(session)=> {
      return await CartService.decrement(user._id, value.cartItemId, session)
    })
    
    useAppResponse(res, 
      new AppResponse(200)
      .setData(cartItem)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller decrement')
  }
}


export const byeAll: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try {
    if (! user.buyingDetails) {
      throw new AppResponse(400)
      .runCommand('UPDATE_BUYINGDETAILES', null)
      .setScreenMessage('Buing Detailes is required', ScreenMessageType.WARN)
    }

    const cartItems = await CartService.getCart(user._id)

    const promises = cartItems.map(async(cartItem)=> {
      return new Promise(async(resolve, reject)=> {
        try {
          const newOrder = await Services.withSession<Order.Create>( async(session)=> {
            const product = await ProductService.getProduct(cartItem.product, true) as HydratedDocument<Product>;

            await ProductService.handleBuying(product.toJSON(), {
              count: cartItem.count,
              types: [],
              color: undefined
            }, session)

            const newOrder: Order.Create = {
              count: cartItem.count,
              status: 'PENDING' as Order.Status,
              product: product._id,
              userId: user?._id,
              color: undefined, // cartItem.color,
              types: [], // set after
              productPrice: product.price, // calc after
              promo: Number(product.promo || 0),
              deliveryPrice: Number(product.delivery || 0),
              buyingDetails: user.buyingDetails!,
            }

            return newOrder;
          })

          Track("BUY" as Pixle.Events)
          resolve(newOrder)
        }catch(e) {
          reject()
        }
      })
    })

    const processes = await Promise.allSettled(promises)
    const orders = processes.filter((promise)=> promise.status === 'fulfilled').map((proce)=> proce.value)

    // @ts-ignore
    await Promise.all(orders.map((o: Order.Create)=> OrderService.create(o)))
    await CartService.cleanCart(user._id)

    useAppResponse(res, 
      new AppResponse(200)
      .setScreenMessage(`Byuing Syccessfully ${orders.length} Orders`, ScreenMessageType.INFO)
      .setData(true)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller decrement')
  }
}