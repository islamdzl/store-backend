import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from "../../shared/app-response.js";
import * as UserService from './user.service.js';
import * as UserValidation from './user.validate.js';
import * as Utils from '../../shared/utils.js';
import * as Services from '../../shared/services.js';
export const register = async (req, res) => {
    const data = req.body;
    try {
        const { error, value } = UserValidation.register(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.WARN);
        }
        const alreadyExist = await UserService.ifExist({ email: value.email });
        if (alreadyExist) {
            throw new AppResponse(409)
                .setScreenMessage('Already exist', ScreenMessageType.WARN);
        }
        const hashedPassword = await Utils.hashPassword(value.password);
        const userInfo = {
            email: value.email,
            username: value.username,
            picture: '/any-user.png',
            password: hashedPassword
        };
        const newUser = await UserService.create(userInfo);
        const response = UserService.loginResponse(newUser.toJSON());
        useAppResponse(res, new AppResponse(200)
            .setData(response));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller register');
    }
};
export const login = async (req, res) => {
    const data = req.body;
    try {
        const { error, value } = UserValidation.login(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.WARN);
        }
        const user = await UserService.getUserByEmail(value.email, true);
        const isTruePassword = await Utils.verifyPassword(value.password, user.password);
        if (!isTruePassword) {
            throw new AppResponse(404)
                .setScreenMessage('Account not found', ScreenMessageType.ERROR);
        }
        const response = UserService.loginResponse(user.toJSON());
        useAppResponse(res, new AppResponse(200)
            .setData(response));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller login');
    }
};
export const deleteAccount = async (req, res) => {
    const user = req.user;
    try {
        await UserService.deleteAccount(user._id);
        useAppResponse(res, new AppResponse(200)
            .setScreenMessage('Deleted!', ScreenMessageType.WARN)
            .reLogIn());
    }
    catch (error) {
        catchAppError(error, res, 'User Controller deleteAccount');
    }
};
export const get = async (req, res) => {
    const user = req.user;
    try {
        const account = await UserService.getUser(user._id, true);
        if (!account) {
            throw new AppResponse(404)
                .setData(null);
        }
        const response = account.toJSON();
        response.isAdmin = Services.isAdmin(account.email);
        delete response.password;
        useAppResponse(res, new AppResponse(200)
            .setData(response));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller get');
    }
};
export const update = async (req, res) => {
    const user = req.user;
    const data = req.body;
    try {
        const { error, value } = UserValidation.update(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.ERROR);
        }
        const updatedUser = await UserService.update(user._id, value);
        const response = updatedUser;
        delete response.password;
        delete response.__v;
        useAppResponse(res, new AppResponse(200)
            .setData(response)
            .setScreenMessage('Updated Syccessfully', ScreenMessageType.INFO));
    }
    catch (error) {
        catchAppError(error, res, 'User Controller update');
    }
};
//# sourceMappingURL=user.controller.js.map