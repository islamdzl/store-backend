import uploadValidate from './upload.validate.js'
import * as UploadService from './upload.service.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';
import path from 'path';


export default async(req: Req, res: Res)=> {
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
      path: `/temp/${req.uploadFileName}`,
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
