import * as OrderService from './order.service.js'
import * as OrderValidate from './order.validate.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';

export const remove: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = OrderValidate.orderId(data)
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    await OrderService.remove(user._id, value.orderId, true)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller remove')
  }
}

export const getUser: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const userOrders = await OrderService.getUser(user._id)

    useAppResponse(res, 
      new AppResponse(200)
      .setData(userOrders)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller getUser')
  }
}

export const getStore: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = OrderValidate.getStore(data)
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const storeOrders = await OrderService.getStore(value.skip, value.limit)

    useAppResponse(res, 
      new AppResponse(200)
      .setData(storeOrders)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller getStore')
  }
}

export const acceptMany: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = OrderValidate.acceptMany(data)
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    await OrderService.acceptMany(value);
    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller acceptMany')
  }
}

export const rejectMany: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = OrderValidate.rejectMany(data)
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    await OrderService.rejectMany(value.ordersIds, value.message)

    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller rejectMany')
  }
}

export const setDoneMany: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = OrderValidate.setDoneMany(data)
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    await OrderService.setDoneMany(user._id, value)

    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller setDoneMany')
  }
}
