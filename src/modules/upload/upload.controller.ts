import uploadValidate from './upload.validate.js'
import * as UploadService from './upload.service.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';
import path from 'path';
import { TD } from '../../shared/statics.js';


export const single =  async(req: Req, res: Res)=> {
  const data = req.query!;
  const user = req.user!;
  const file = req.file!;
  try {
    const { error, value } = uploadValidate(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }
    await UploadService.uploadFile(path.join(TD, req.uploadFileName! || "notExist"), value.process)
    const doc = await UploadService.declareFile(file, user, value.process)
    
    const response = {
      url: `/temp/${req.uploadFileName}`,
      processType: value.process,
      fileName: req.uploadFileName,
      _id: doc._id,
    }

    useAppResponse(res, 
      new AppResponse(200)
      .setData(response)
    )
  }catch(error) {
    catchAppError(error, res, 'Store Controller get')
  }
}

export const many =  async(req: Req, res: Res)=> {
  const data = req.query!;
  const user = req.user!;
  const files = req.files! as Express.Multer.File[];
  try {
    const { error, value } = uploadValidate(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }
    const processResult = await Promise.allSettled(
      files.map((file: Express.Multer.File, index)=> new Promise(async(resolve, reject)=> {
        try {
          await UploadService.uploadFile(path.join(TD, file.filename!), value.process)

          const doc = await UploadService.declareFile(file, user, value.process)
          resolve({
            url: `/temp/${file.filename}`,
            processType: value.process,
            fileName: file.filename,
            _id: doc._id,
          })
        }catch(error) {
          reject(error)
        }
      }))
    )

    useAppResponse(res, 
      new AppResponse(200)
      .setData(
        processResult
        .filter((p)=> p.status === 'fulfilled')
        .map((p)=> p.value as any)
      )
    )
  }catch(error) {
    catchAppError(error, res, 'Store Controller get')
  }
}
