import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from "../../shared/app-response.js";
import * as UserService from './user.service.js'
import * as UserValidation from './user.validate.js'
import * as Utils from '../../shared/utils.js'
import type { HydratedDocument } from "mongoose";

export const register: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;

  try {
    const { error, value } = UserValidation.register(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.WARN)
    }

    const alreadyExist = await UserService.ifExist({email: value.email})
    if (alreadyExist) {
      throw new AppResponse(409)
      .setScreenMessage('Already exist', ScreenMessageType.WARN)
    }

    const hashedPassword = await Utils.hashPassword(value.password);
    const userInfo: Partial<User> = {
      email: value.email,
      password: hashedPassword
    }
    const newUser = await UserService.create(userInfo)
    
    const response = UserService.loginResponse(newUser.toJSON());
    useAppResponse(res, 
      new AppResponse(200)
      .setData(response)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller register')
  }
}

export const login: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;

  try {
    const { error, value } = UserValidation.login(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.WARN)
    }

    const user = await UserService.getUserByEmail(value.email, true) as HydratedDocument<User>
    const response = UserService.loginResponse(user.toJSON())
    useAppResponse(res, 
      new AppResponse(200)
      .setData(response)
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller login')
  }
}

export const deleteAccount: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;

  try {

    await UserService.deleteAccount(user._id);

    useAppResponse(res, 
      new AppResponse(200)
      .setScreenMessage('Deleted!', ScreenMessageType.WARN)
      .reLogIn()
    )
  } catch(error) {
    catchAppError(error, res, 'User Controller deleteAccount')
  }
}