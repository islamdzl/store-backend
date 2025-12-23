import StoreService from './store.service.js'
import * as Services from '../../shared/services.js'
import UploadService, { } from '../upload/upload.service.js'
import * as StoreValidate from './store.validate.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';


export const get: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user;
  try {
    let IsAdmin = false;
    
    if (user && await Services.isAdmin(user!.email)) {
      IsAdmin = true;
    }
    const store = await StoreService.getStore(true);

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
      await new UploadService()
      .removeFilesPaths(['store-logo.png'])
      .staticFile('store-logo.png')
      .saveFilesIds([value.logo])
      .destinationDirectory('')
      .processType('LOGO')
      .user(user._id)
      .Execute()
    }

    if (value.banner) {
      await new UploadService()
      .removeFilesPaths(['store-banner.png'])
      .staticFile('store-banner.png')
      .saveFilesIds([value.banner])
      .destinationDirectory('')
      .processType('BANNER')
      .user(user._id)
      .Execute()
    }

    const result = await StoreService.updateStore(value)

    useAppResponse(res, 
      new AppResponse(200)
      .setData(result)
      .setScreenMessage('Updated successfully', ScreenMessageType.INFO)
    )
  }catch(error) {
    catchAppError(error, res, 'Store Controller get')
  }
}