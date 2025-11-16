import { Types } from "mongoose";
import ProductModel from "./product.model.js";
import AppResponse, { ScreenMessageType } from "../../shared/app-response.js";
import UploadService from '../upload/upload.service.js';
export const getProduct = (productId, force) => {
    const product = ProductModel.findById(productId);
    if (!product && force) {
        throw new AppResponse(404)
            .setScreenMessage('Product not found', ScreenMessageType.WARN);
    }
    return product;
};
export const removeProduct = async (productId) => {
    const product = await ProductModel.findByIdAndDelete(new Types.ObjectId(productId));
    if (!product) {
        throw new AppResponse(404)
            .setScreenMessage('Product not found', ScreenMessageType.ERROR);
    }
    await new UploadService()
        .removeFilesPaths(product.images)
        .Execute();
    return product.toJSON();
};
export const createProduct = async (productData, session) => {
    const newProduct = new ProductModel(productData);
    await newProduct.save({ session });
    return newProduct;
};
export const updateProduct = async (productId, newProduct, session) => {
    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, { $set: newProduct }, { new: true, session });
    if (!updatedProduct) {
        throw new AppResponse(404)
            .setScreenMessage('Product to update not found', ScreenMessageType.ERROR);
    }
    return updatedProduct;
};
export const changequantityAndReqursts = async (productId, quantity, requests, force, session) => {
    const product = await ProductModel.findById(productId);
    if (!product) {
        if (force) {
            throw new AppResponse(404)
                .setScreenMessage('Product not found', ScreenMessageType.ERROR);
        }
        return;
    }
    if (Number.isInteger(product.quantity)) {
        product.quantity += quantity;
    }
    product.requests += requests;
    await product.save({ session });
};
export const setActivity = async (productId, activity, force, session) => {
    const product = await ProductModel.findByIdAndUpdate(productId, { isActive: activity }, { session });
    if (!product) {
        if (force) {
            throw new AppResponse(404)
                .setScreenMessage('Product not found', ScreenMessageType.ERROR);
        }
        return;
    }
};
export const handleBuying = async (product, userCount, session) => {
    if (product.quantity !== null && product.quantity < userCount) {
        throw new AppResponse(400)
            .setScreenMessage(`Remaining ${product.quantity} only`, ScreenMessageType.WARN);
    }
    await changequantityAndReqursts(product._id, -userCount, 1, true, session);
};
//# sourceMappingURL=product.service.js.map