import * as LikeService from './like.service.js'
import * as LikeValidate from './like.validate.js'
import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from "../../shared/app-response.js";
import Track from '../pixel/index.js';

export const get: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const likes = await LikeService.getUser(user._id)
    useAppResponse(res,
      new AppResponse(200)
      .setData(likes)
    )
  }catch(error) {
    catchAppError(error, res, 'Like Controller create')
  }
}

export const create: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = LikeValidate.create(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    Track("LIKE_ADD" as Pixle.Events)
    await LikeService.create(user._id, value.productId)
    const likes = await LikeService.getUser(user._id)
    useAppResponse(res,
      new AppResponse(200)
      .setData(likes)
    )
  }catch(error) {
    catchAppError(error, res, 'Like Controller create')
  }
}

export const remove: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = LikeValidate.remove(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    Track("LIKE_REOVE" as Pixle.Events)
    await LikeService.remove(user._id, value.productId, value.likeItemId, /** session */)
    const likes = await LikeService.getUser(user._id)
    useAppResponse(res,
      new AppResponse(200)
      .setData(likes)
    )
  }catch(error) {
    catchAppError(error, res, 'Like Controller remove')
  }
}