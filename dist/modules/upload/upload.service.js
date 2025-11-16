import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';
import UploadModel from './upload.model.js';
import * as Utils from '../../shared/utils.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import SystemError from '../../shared/system-error.js';
const UD = path.join(process.cwd(), 'uploads');
class Processes {
    static async LOGO(buffer) {
        return await sharp(buffer)
            .resize(512, 512, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toBuffer();
    }
    static async ICON(buffer) {
        return await sharp(buffer)
            .resize(200, 200, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toBuffer();
    }
    static async BANNER(buffer) {
        return await sharp(buffer)
            .resize(1024, 512, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toBuffer();
    }
    static async PRODUCT_IMAGE(buffer) {
        return await sharp(buffer)
            .resize(800, 800, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toBuffer();
    }
}
export const declareFile = async (file, user, process) => {
    const newFileSchema = {
        destination: file.destination,
        filename: file.filename,
        mimetype: file.mimetype,
        process: process,
        userId: user._id,
        directory: '/temp',
    };
    const newFile = new UploadModel(newFileSchema);
    await newFile.save();
    return newFile.toJSON();
};
export const uploadFile = async (filePath, processType) => {
    const exist = fs.existsSync(filePath);
    if (!exist) {
        throw new AppResponse(404)
            .setScreenMessage('File not exist', ScreenMessageType.ERROR);
    }
    const fileBuffer = await fs.promises.readFile(filePath);
    if (!Processes[processType]) {
        throw new AppResponse(400)
            .setScreenMessage(`Unknown process type: ${processType}`, ScreenMessageType.ERROR);
    }
    const updatedBuffer = await Processes[processType](fileBuffer);
    await fs.promises.rm(filePath);
    await fs.promises.writeFile(filePath, updatedBuffer);
    return declareFile;
};
export default class SaveFile {
    _saveFilesIds = [];
    _saveFilesPaths = [];
    _removeFilesIds = [];
    _removeFilesPaths = [];
    _processTimeStart;
    _processTimeEnd;
    _session = undefined;
    _userId = undefined;
    _destinationDirectory = 'any';
    constructor() { }
    saveFilesIds(ids) {
        this._saveFilesIds = ids;
        return this;
    }
    saveFilesPaths(paths) {
        this._saveFilesPaths = paths;
        return this;
    }
    removeFilesIds(ids) {
        this._removeFilesIds = ids;
        return this;
    }
    removeFilesPaths(paths) {
        this._removeFilesPaths = paths;
        return this;
    }
    processType(processType) {
        this._processType = processType;
        return this;
    }
    destinationDirectory(directory, ymd) {
        this._destinationDirectory = directory;
        if (ymd)
            this._destinationDirectory = this._destinationDirectory + Utils.YMD();
        return this;
    }
    session(session) {
        this._session = session;
        return this;
    }
    staticFile(filename) {
        this._staticFile = filename;
        return this;
    }
    setStartProcessTime(time) {
        this._processTimeStart = time;
        return this;
    }
    force(savedResults) {
        if (savedResults)
            this._requiredSavedResults = savedResults;
        return this;
    }
    user(userId) {
        this._userId = userId;
        return this;
    }
    /**
     * - Exeute process
     * @returns {Promise<Upload.ExecuteResult>}
     */
    async Execute() {
        let filesToRemove = [];
        let filesToSave = [];
        let filesToRemoveRusolt = [];
        let filesToSaveRusolt = [];
        if (!this._processTimeStart)
            this._processTimeStart = Date.now();
        if (this._saveFilesIds || this._saveFilesPaths) {
            filesToSave = await UploadModel.find({
                userId: this._userId,
                directory: '/temp',
                $or: [
                    { filename: [...this._saveFilesPaths.map((p) => p.split('/')[p.split('/').length - 1])] },
                    { _id: this._saveFilesIds },
                ]
            });
        }
        if (this._removeFilesIds || this._removeFilesPaths) {
            filesToRemove = await UploadModel.find({
                userId: this._userId,
                directory: '/temp',
                $or: [
                    { filename: [...this._removeFilesPaths.map((p) => p.split('/')[p.split('/').length - 1])] },
                    { _id: this._removeFilesIds },
                ]
            });
        }
        if (this._processType) {
            filesToSave.forEach((p) => {
                if (p.process !== this._processType) {
                    throw new AppResponse(400)
                        .setScreenMessage(`Process Type Expected "${this.processType}"`, ScreenMessageType.ERROR);
                }
            });
        }
        if (this._staticFile) {
            if (filesToSave.length !== 1) {
                throw new SystemError('SaveFile StaticFile mode expected one file!');
            }
        }
        if (this._requiredSavedResults) {
            let exists = 0;
            for (let i = 0; i < filesToSave.length; i++) {
                const p = filesToSave[i]?.toJSON();
                if (!p || exists === this._requiredSavedResults)
                    continue;
                if (fs.existsSync(path.join(UD, p.directory, p.filename)))
                    exists++;
            }
            if (exists < this._requiredSavedResults) {
                throw new AppResponse(404)
                    .setScreenMessage('File Deleted!', ScreenMessageType.ERROR);
            }
        }
        if (filesToSave) {
            await fs.promises.mkdir(path.join(UD, this._destinationDirectory), { recursive: true });
            await Promise.allSettled(filesToSave.map((p) => new Promise(async (resolve, reject) => {
                try {
                    const fileName = this._staticFile || p.filename;
                    if (!fs.existsSync(path.join(UD, p.directory, p.filename)))
                        return reject(new SystemError(`File not exists: ${path.join(UD, p.directory, p.filename)}`));
                    await fs.promises.cp(path.join(UD, p.directory, p.filename), path.join(UD, this._destinationDirectory, fileName));
                    await fs.promises.rm(path.join(UD, p.directory, p.filename));
                    p.directory = this._destinationDirectory;
                    p.destination = path.join(UD, this._destinationDirectory);
                    await p.save({ session: this._session });
                    resolve(p.toJSON());
                }
                catch (error) {
                    reject(error);
                }
            })))
                .then((r) => filesToSaveRusolt = r);
        }
        if (filesToRemove) {
            await Promise.allSettled(filesToRemove.map((p) => new Promise(async (resolve, reject) => {
                try {
                    await fs.promises.rm(path.join(UD, p.directory, p.filename), {});
                    await p.deleteOne();
                    resolve(p.toJSON());
                }
                catch (error) {
                    reject(error);
                }
            })))
                .then((r) => filesToRemoveRusolt = r);
        }
        this._processTimeEnd = Date.now();
        const result = {
            removed: filesToRemoveRusolt.filter((r) => r.status === 'fulfilled').map((r) => r.value),
            saved: filesToSaveRusolt.filter((r) => r.status === 'fulfilled').map((r) => r.value),
            processTime: this._processTimeEnd - this._processTimeStart,
            getRemoved() { return this.removed; },
            getSaved() { return this.saved; },
            getSavedPaths() { return this.saved.map((p) => path.join(p.directory, p.filename)); }
        };
        return result;
    }
}
//# sourceMappingURL=upload.service.js.map