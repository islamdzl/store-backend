import uploadValidate from './upload.validate.js';
import * as UploadService from './upload.service.js';
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';
import path from 'path';
export const single = async (req, res) => {
    const data = req.query;
    const user = req.user;
    const file = req.file;
    try {
        const { error, value } = uploadValidate(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.ERROR);
        }
        await UploadService.uploadFile(path.join(process.cwd(), 'uploads/temp', req.uploadFileName), value.process);
        const doc = await UploadService.declareFile(file, user, value.process);
        const response = {
            url: `/temp/${req.uploadFileName}`,
            processType: value.process,
            fileName: req.uploadFileName,
            _id: doc._id,
        };
        useAppResponse(res, new AppResponse(200)
            .setData(response));
    }
    catch (error) {
        catchAppError(error, res, 'Store Controller get');
    }
};
export const many = async (req, res) => {
    const data = req.query;
    const user = req.user;
    const files = req.files;
    try {
        const { error, value } = uploadValidate(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.ERROR);
        }
        const processResult = await Promise.allSettled(files.map((file, index) => new Promise(async (resolve, reject) => {
            try {
                await UploadService.uploadFile(path.join(process.cwd(), 'uploads/temp', file.filename), value.process);
                const doc = await UploadService.declareFile(file, user, value.process);
                resolve({
                    url: `/temp/${file.filename}`,
                    processType: value.process,
                    fileName: file.filename,
                    _id: doc._id,
                });
            }
            catch (error) {
                reject(error);
            }
        })));
        useAppResponse(res, new AppResponse(200)
            .setData(processResult.filter((p) => p.status === 'fulfilled')
            .map((p) => p.value)));
    }
    catch (error) {
        catchAppError(error, res, 'Store Controller get');
    }
};
//# sourceMappingURL=upload.controller.js.map