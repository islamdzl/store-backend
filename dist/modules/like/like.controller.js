import * as LikeService from './like.service.js';
import * as LikeValidate from './like.validate.js';
import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from "../../shared/app-response.js";
export const get = async (req, res) => {
    const data = req.body;
    const user = req.user;
    try {
        const likes = await LikeService.getUser(user._id);
        useAppResponse(res, new AppResponse(200)
            .setData(likes));
    }
    catch (error) {
        catchAppError(error, res, 'Like Controller create');
    }
};
export const create = async (req, res) => {
    const data = req.body;
    const user = req.user;
    try {
        const { error, value } = LikeValidate.create(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.ERROR);
        }
        await LikeService.create(user._id, value.productId);
        const likes = await LikeService.getUser(user._id);
        useAppResponse(res, new AppResponse(200)
            .setData(likes));
    }
    catch (error) {
        catchAppError(error, res, 'Like Controller create');
    }
};
export const remove = async (req, res) => {
    const data = req.body;
    const user = req.user;
    try {
        const { error, value } = LikeValidate.remove(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.ERROR);
        }
        await LikeService.remove(user._id, value.productId, value.likeItemId);
        const likes = await LikeService.getUser(user._id);
        useAppResponse(res, new AppResponse(200)
            .setData(likes));
    }
    catch (error) {
        catchAppError(error, res, 'Like Controller remove');
    }
};
//# sourceMappingURL=like.controller.js.map