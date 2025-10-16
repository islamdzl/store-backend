import StoreService from './store.service.js'
import UploadService from '../upload/upload.service.js'
import * as StoreValidate from './store.validate.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';


export const get: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  try {
    const store = await StoreService.getStore();
    const response = new AppResponse(200)
    .setData(store)
    useAppResponse(res, response)
  }catch(error) {
    catchAppError(error, res, 'Store Controller get')
  }
}

export const update: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    const { error, value } = StoreValidate.update(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    if (value.logo) {
      await new UploadService([value.logo])
      .distinationDir('')
      .setStaticFileName('store-logo.png')
      .replace(['store-logo.png'])
      .Execute(user._id)
    }

    if (value.banner) {
      await new UploadService([value.banner])
      .distinationDir('')
      .setStaticFileName('store-banner.png')
      .replace(['store-banner.png'])
      .Execute(user._id)
    }

    useAppResponse(res, 
      new AppResponse(200)
      .setData(await StoreService.updateStore(value))
    )
  }catch(error) {
    catchAppError(error, res, 'Store Controller get')
  }
}