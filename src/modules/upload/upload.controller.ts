import uploadValidate from './upload.validate.js'
import * as UploadService from './upload.service.js'
import * as Interfaces from '../../shared/interfaces.js'
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
    await UploadService.uploadFile(path.join(process.cwd(), 'uploads'), value.process)

    const fileId = await UploadService.declareFile(file, user, value.process)

    const response = {
      processType: value.process,
      fileId
    }

    useAppResponse(res, 
      new AppResponse(200)
      .setData(response)
    )
  }catch(error) {
    catchAppError(error, res, 'Store Controller get')
  }
}
