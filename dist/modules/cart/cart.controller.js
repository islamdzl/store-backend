import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from '../../shared/app-response.js';
import * as CartValidation from './cart.validate.js';
import * as cartServise from './cart.service.js';
export const get = async (req, res) => {
    const user = req.user;
    try {
        const cart = await cartServise.getCart(user._id);
        useAppResponse(res, new AppResponse(200)
            .setData(cart));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller get');
    }
};
export const addProduct = async (req, res) => {
    const user = req.user;
    const data = req.body;
    try {
        const { error, value } = CartValidation.addProduct(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.WARN);
        }
        const cartItem = {
            product: value.productId,
            count: value.count,
        };
        const cart = await cartServise.addProduct(user._id, cartItem);
        useAppResponse(res, new AppResponse(200)
            .setData(cart));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller addProduct');
    }
};
export const removeProduct = async (req, res) => {
    const user = req.user;
    const data = req.body;
    try {
        const { error, value } = CartValidation.removeProduct(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.WARN);
        }
        const cart = await cartServise.removeProduct(user._id, value.productId, value.cartItemId);
        useAppResponse(res, new AppResponse(200)
            .setData(cart));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller removeProduct');
    }
};
export const encrement = async (req, res) => {
    const user = req.user;
    const data = req.body;
    try {
        const { error, value } = CartValidation.encrement(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.WARN);
        }
        const cartItem = await cartServise.encrement(user._id, value.cartItemId);
        useAppResponse(res, new AppResponse(200)
            .setData(cartItem));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller encrelent');
    }
};
export const decrement = async (req, res) => {
    const user = req.user;
    const data = req.body;
    try {
        const { error, value } = CartValidation.decrement(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.WARN);
        }
        const cartItem = await cartServise.decrement(user._id, value.cartItemId);
        useAppResponse(res, new AppResponse(200)
            .setData(cartItem));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller decrement');
    }
};
//# sourceMappingURL=cart.controller.js.map