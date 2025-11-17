import uploadValidate from './upload.validate.js'
import * as UploadService from './upload.service.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';
import path from 'path';


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
    await UploadService.uploadFile(path.join(process.cwd(), 'uploads/temp', req.uploadFileName!), value.process)
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
  console.log('controller 1')
  try {
    const { error, value } = uploadValidate(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }
    const processResult = await Promise.allSettled(
      files.map((file: Express.Multer.File, index)=> new Promise(async(resolve, reject)=> {
        try {
          console.log('controller 2')
          await UploadService.uploadFile(path.join(process.cwd(), 'uploads/temp', file.filename!), value.process)
          console.log('controller 3')
          const doc = await UploadService.declareFile(file, user, value.process)
          console.log('controller 4')
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
        processResult.filter((p)=> p.status === 'fulfilled')
        .map((p)=> p.value)
      )
    )
  }catch(error) {
    catchAppError(error, res, 'Store Controller get')
  }
}
