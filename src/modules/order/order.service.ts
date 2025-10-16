import type { ClientSession } from 'mongoose';
import OrderModel from './order.model.js'
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';


export const getStore: (skip: number, limit: number)=> Promise<Order[]> = async(skip, limit)=> {
  const orders = await OrderModel.find()
  .sort({ createdAt: 1})
  .lean()
  .skip(skip)
  .limit(limit)
  .exec()

  return orders;
}

export const getUser: (userId: ID)=> Promise<Order[]> = async(userId)=> {
  const orders = await OrderModel.find({userId})
  .sort({ createdAt: 1})
  .lean()
  .exec()

  return orders;
}

export const create: (order: Order.Create, session?: ClientSession)=> Promise<void> = async(order, session)=> {
  const newOrder = new OrderModel(order);
  await newOrder.save({session})
}

export const remove: (userId: ID, productId: ID, force?: boolean, session?: ClientSession)=> Promise<void> = async(userId, productId, force, session)=> {
  const order = await OrderModel.findOneAndDelete(
    {userId, product: productId}, 
    {session}
  )
  if (! order) {
    if (force) {
      throw new AppResponse(404)
      .setScreenMessage('Order not found', ScreenMessageType.ERROR)
    }
    return;
  }
}


export const acceptMany: (updates: Order.AcceptMany[])=> Promise<number> = async(updates)=> {

  const retult = await Promise.allSettled(
    updates.map((u)=> OrderModel.findByIdAndUpdate(u.orderId, {
      status: Order.Status.ACCEPTED,
      trackingCode: u.trackingCode,
      message: u.message
    },
  {
    new: true
  }))
  )

  return retult.reduce((count, r)=> (r.status === 'fulfilled' ? count + 1 : count), 0)
}

export const rejectMany: (orderIds: ID[], message?: string)=> Promise<number> = async(orderIds, message)=> {
  const updated = await OrderModel.updateMany(
    {
      _id: { $in: orderIds },
    },
    {
      status: Order.Status.REJECTED,
      message
    }
  )
  return updated.modifiedCount;
}

export const setDoneMany: (userId: ID, orderIds: ID[])=> Promise<void> = async(userId, orderIds)=> {

  await OrderModel.updateMany(
    {
      _id: { $in: orderIds}, userId
    }, {
      status: Order.Status.FULFILLED
    }
  )
}
