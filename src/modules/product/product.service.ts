import type { ClientSession, HydratedDocument } from "mongoose";
import ProductModel from "./product.model.js";
import AppResponse, { ScreenMessageType } from "../../shared/app-response.js";
import UploadService from '../upload/upload.service.js';

export const getProduct: (productId: ID, force?: boolean)=> Promise<HydratedDocument<Product> | null> = (productId, force)=> {
  const product = ProductModel.findById(productId);
  if (! product && force) {
    throw new AppResponse(404)
    .setScreenMessage('Product not found', ScreenMessageType.WARN)
  }
  return product;
}

export const removeProduct: (productId: ID)=> Promise<Product> = async(productId)=> {
  const product = await ProductModel.findByIdAndDelete(productId)
  if (! product) {
    throw new AppResponse(404)
    .setScreenMessage('Product not found', ScreenMessageType.ERROR)
  }

  await new UploadService()
  .removeFilesPaths(product.images)
  .Execute()
  
  return product.toJSON(); 
}

export const createProduct: (productData: Product.Create, session?: ClientSession)=> Promise<HydratedDocument<Product>> = async(productData, session)=> {
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

export const changeContityAndReqursts: (productId: ID, contity: number, requests: number, force?: boolean, session?: ClientSession)=> Promise<void> = async(productId, contity, requests, force, session)=> {
  const product = await ProductModel.findById(productId)

  if (! product) {
    if (force) {
      throw new AppResponse(404)
      .setScreenMessage('Product not found', ScreenMessageType.ERROR)
    }
    return;
  }

  product.contity += contity;
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

export const handleBuying: (product: Product, userCount: number, session?: ClientSession)=> Promise<void> = async(product, userCount, session)=> {
  if (product.contity < userCount) {
    throw new AppResponse(400)
    .setScreenMessage(`Remaining ${product.contity} only`, ScreenMessageType.WARN)
  }

  await changeContityAndReqursts(product._id, -userCount, 1, true, session)
}