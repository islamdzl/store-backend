import { Types, type ClientSession, type HydratedDocument } from "mongoose";
import ProductModel from "./product.model.js";
import AppResponse, { ScreenMessageType } from "../../shared/app-response.js";
import UploadService from '../upload/upload.service.js';
import OrdersModel from '../order/order.model.js'

export const getProduct: (productId: ID, force?: boolean)=> Promise<HydratedDocument<Product> | null> = (productId, force)=> {
  const product = ProductModel.findById(productId);
  if (! product && force) {
    throw new AppResponse(404)
    .setScreenMessage('Product not found', ScreenMessageType.WARN)
  }
  return product;
}

export const removeProduct: (productId: ID)=> Promise<Product> = async(productId)=> {
  const product = await ProductModel.findByIdAndDelete(new Types.ObjectId(productId))
  if (! product) {
    throw new AppResponse(404)
    .setScreenMessage('Product not found', ScreenMessageType.ERROR)
  }

  await new UploadService()
  .removeFilesPaths(product.images)
  .Execute()
  
  return product.toJSON(); 
}

export const createProduct: (productData: Partial<Product.Create>, session?: ClientSession)=> Promise<HydratedDocument<Product>> = async(productData, session)=> {
  const newProduct = new ProductModel(productData)
  await newProduct.save({session})
  return newProduct;
}

export const updateProduct: (productId: ID, newProduct: Partial<Product>, session?: ClientSession)=> Promise<HydratedDocument<Product>> = async(productId, newProduct, session)=> {
  const updatedProduct = await ProductModel.findByIdAndUpdate(productId,
    {$set: newProduct},
    {new: true, session}
  )
  if (! updatedProduct) {
    throw new AppResponse(404)
    .setScreenMessage('Product to update not found', ScreenMessageType.ERROR)
  }
  return updatedProduct;
}

export const changequantityAndReqursts: (productId: ID, quantity: number, requests: number, force?: boolean, session?: ClientSession)=> Promise<void> = async(productId, quantity, requests, force, session)=> {
  const product = await ProductModel.findById(productId)

  if (! product) {
    if (force) {
      throw new AppResponse(404)
      .setScreenMessage('Product not found', ScreenMessageType.ERROR)
    }
    return;
  }

  if (Number.isInteger(product.quantity)) {
    product.quantity! += quantity;
  }
  
  product.requests += requests;

  await product.save({session})
}

export const setActivity: (productId: ID, activity: boolean, force?: boolean, session?: ClientSession)=> Promise<void> = async(productId, activity, force, session)=> {
  const product = await ProductModel.findByIdAndUpdate(productId,
    { isActive: activity },
    { session }
  )

  if (! product) {
    if (force) {
      throw new AppResponse(404)
      .setScreenMessage('Product not found', ScreenMessageType.ERROR)
    }
    return;
  }
}


interface IhandleBuyingUserData {
  count: number;
  color?: string;
  types: Product.Request.Buy.Type[];
}
export const handleBuying: (product: Product, data: IhandleBuyingUserData,  session?: ClientSession)=> Promise<void> = async(product, data, session)=> {
  if (product.quantity !== null && product.quantity < data.count) {
    throw new AppResponse(400)
    .setScreenMessage(`Remaining ${product.quantity} only`, ScreenMessageType.WARN)
  }
  
  if (data.color) {
    const isExistColor = product.colors.find((c)=> data.color)
    if (! isExistColor) {
      throw new AppResponse(400)
      .setScreenMessage('Product color not found', ScreenMessageType.ERROR)
    }
  }

  if (data.types && data.types.length) {
    data.types.forEach((type)=> {
      const isExistType  = product.types.find((t)=> t.typeName === type.typeName)
      const isExistIndex = isExistType?.values[type.selectedIndex]
      if (! isExistType || ! isExistIndex) {
        throw new AppResponse(400)
        .setScreenMessage('Product type not found', ScreenMessageType.ERROR)
      }
    })
  }

  await changequantityAndReqursts(product._id, - data.count, 1, true, session)
}


export const handleDoubleOrder: (userId: ID, productId: ID, scends?: number)=> Promise<void> = async(userId, productId, scends = 20)=> {

  const ST = new Date()
  const ET = new Date(ST.getTime() - (1000 * scends))

  const lastOrders = await OrdersModel.find({
    product: productId,
    userId: userId,
    createdAt: {
      $gte: ET,
      $lte: ST,
    },
  }, {_id: 1})
  .lean()
  .exec()

  if (lastOrders.length !== 0) {
    throw new AppResponse(400)
    .setScreenMessage('Already Buied!', ScreenMessageType.INFO)
  }
}