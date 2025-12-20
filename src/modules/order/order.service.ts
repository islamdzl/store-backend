import type { ClientSession, HydratedDocument } from 'mongoose';
import OrderModel from './order.model.js'
import * as PurchaseService from '../purchase/purchase.service.js'
import * as ProductService from '../product/product.service.js'
import * as XLSX from 'xlsx'
import * as Utils from '../../shared/utils.js'
import fs from 'fs'
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';
import path from 'path';
import { UD } from '../../shared/statics.js'


export const getStore: (skip: number, limit: number)=> Promise<Order[]> = async(skip, limit)=> {
  const orders = await OrderModel.find({status: 'PENDING'})
  .sort({ createdAt: 1})
  .lean()
  .skip(skip)
  .limit(limit)
  .populate('product')
  .exec()

  return orders;
}

export const getUser: (userId: ID)=> Promise<Order[]> = async(userId)=> {
  const orders = await OrderModel.find({userId})
  .sort({ createdAt: 1})
  .populate('product')
  .lean()
  .exec()

  return orders;
}

export const create: (order: Order.Create, session?: ClientSession)=> Promise<void> = async(order, session)=> {
  const newOrder = new OrderModel(order);
  await newOrder.save({session})
}

export const remove: (userId: ID, orderId: ID, force?: boolean, session?: ClientSession)=> Promise<void> = async(userId, orderId, force, session)=> {
  const order = await OrderModel.findOneAndDelete(
    {userId, _id: orderId}, 
    {session}
  )
  if (! order) {
    if (force) {
      throw new AppResponse(404)
      .setScreenMessage('Order not found', ScreenMessageType.ERROR)
    }
    return;
  }

  await ProductService.changequantityAndReqursts(order.product, order.count, -1)
}


export const acceptMany: (updates: Order.Request.AcceptMany[])=> Promise<{count: number, url: string}> = async(updates)=> {

  const result: PromiseSettledResult<HydratedDocument<Order> | null>[] = await Promise.allSettled(
    updates.map((u)=> OrderModel.findByIdAndUpdate(u.orderId, {
      status:'ACCEPTED',
      trackingCode: u.trackingCode,
      message: u.message
    },
    {
      new: true
    }))
    
  )
  const updatedOrders = result.filter((r: PromiseSettledResult<HydratedDocument<Order> | any>)=> r.status === 'fulfilled').map((r)=> r.value!.toJSON())
  PurchaseService.createMany(updatedOrders.map((o)=> ({
    deliveryPrice: o.deliveryPrice || 0,
    productPrice: o.productPrice   || 0,
    productId: o.product,
    client: o.userId,
    count: o.count,
  })))

  const orders = result
  .filter((p)=> p.status === 'fulfilled')
  .filter((p)=> p.value)
  .map((p)=> p.value!.toJSON())
  const jsonData = Utils.buildXLSXFileJSONDataOf_orders(orders)
  const workSheet = XLSX.utils.json_to_sheet(jsonData)
  const book = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(book, workSheet, 'Orders')
  const xlsxFileBuffer = XLSX.write(book, {bookType: 'xlsx', type: 'buffer'})
  const fileName = Date.now().toString() + '.xlsx';
  if (!  fs.existsSync(path.join(UD, 'xlsx-files'))) {
    await fs.mkdirSync(path.join(UD, 'xlsx-files'))
  }
  await fs.promises.writeFile(path.join(UD, 'xlsx-files', fileName), xlsxFileBuffer)

  return {
    count: result.reduce((count, r)=> (r.status === 'fulfilled' ? count + 1 : count), 0),
    url: '/uploads/xlsx-files/' + fileName
  }
}

export const rejectMany: (orderIds: ID[], message?: string)=> Promise<number> = async(orderIds, message)=> {
  const updated = await OrderModel.updateMany(
    {
      _id: { $in: orderIds },
    },
    {
      status: 'REJECTED',
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
      status: 'FULFILLED'
    }
  )
}
