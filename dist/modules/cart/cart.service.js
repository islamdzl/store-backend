import CartModel from './cart.model.js';
import * as LikeService from '../like/like.service.js';
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';
export const addProduct = async (userId, cartItem, session) => {
    const newCart = new CartModel({ ...cartItem, ownerId: userId });
    await newCart.save({ session });
    return await getCart(userId);
};
export const removeProduct = async (userId, productId, cartItemId, session) => {
    const cartItem = await CartModel.findOneAndDelete({
        ownerId: userId,
        $or: [
            { _id: cartItemId },
            { product: productId }
        ],
    });
    if (!cartItem) {
        throw new AppResponse(404)
            .setScreenMessage('Cart item not found', ScreenMessageType.ERROR);
    }
    return await getCart(userId);
};
export const getCart = async (userId) => {
    const cartItems = await CartModel.find({ ownerId: userId })
        .lean()
        .populate('product')
        .exec();
    return cartItems;
};
export const ifCartHas = async (products, userId) => {
    if (userId) {
        const cart = await CartModel.find({ ownerId: userId })
            .lean()
            .exec();
        const cartProductsIds = cart.map((p) => p.product.toString());
        return products
            .filter((p) => p)
            .map((p) => cartProductsIds.includes(p._id?.toJSON()) ? ({ ...p, inCart: true }) : ({ ...p, inCart: false }));
    }
    return products.map((p) => ({ ...p, inCart: false }));
};
export const encrement = async (userId, cartItemId, session) => {
    const cartItem = await CartModel.findOneAndUpdate({
        ownerId: userId, _id: cartItemId
    }, {
        $inc: {
            count: 1
        }
    }, { session, new: true })
        .lean();
    if (!cartItem) {
        throw new AppResponse(404)
            .setScreenMessage('Cart Item not found', ScreenMessageType.ERROR);
    }
    return cartItem;
};
export const decrement = async (userId, cartItemId, session) => {
    const cartItem = await CartModel.findOneAndUpdate({
        ownerId: userId, _id: cartItemId
    }, {
        $inc: {
            count: -1
        }
    }, { session, new: true })
        .lean();
    if (!cartItem) {
        throw new AppResponse(404)
            .setScreenMessage('Cart Item not found', ScreenMessageType.ERROR);
    }
    return cartItem;
};
//# sourceMappingURL=cart.service.js.map