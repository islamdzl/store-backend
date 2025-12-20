import AppResponse, { ScreenMessageType } from '../../shared/app-response.js'
import UploadModel from './upload.model.js'
import * as Utils from '../../shared/utils.js'
import sharp from 'sharp'
import fs from 'fs'
import type { ClientSession, HydratedDocument } from 'mongoose';
import path from 'path';
import SystemError from '../../shared/system-error.js'
import { UD } from '../../shared/statics.js'


class Processes {
  public static async LOGO(buffer: Buffer) {
    return await sharp(buffer)
      .resize(512, 512, { fit: 'cover', position: 'center'})
      .jpeg({ quality: 85 })
      .toBuffer();
  }
  public static async ICON(buffer: Buffer) {
      return await sharp(buffer)
        .resize(200, 200, { fit: 'cover', position: 'center'})
        .jpeg({ quality: 85 })
        .toBuffer();
    }
  public static async BANNER(buffer: Buffer) {
    return await sharp(buffer)
      .resize(1024, 512, { fit: 'cover', position: 'center'})
      .jpeg({ quality: 85 })
      .toBuffer();
  }
  public static async PRODUCT_IMAGE(buffer: Buffer) {
    return await sharp(buffer)
      // .resize(800, 800, { fit: 'cover', position: 'center'})
      .jpeg({ quality: 85 })
      .toBuffer();
  } 
  public static async PRODUCT_IMAGE_PREVIEW(buffer: Buffer) {
    return await sharp(buffer)
      .resize(800, 800, { fit: 'cover', position: 'center'})
      .jpeg({ quality: 20 })
      .toBuffer();
  }
}

export const reProcess: (UDPath: string, processType: Upload.ProcessType, force?: boolean)=> Promise<void> = async (UDPath, processType, force = true)=> {
  const fullPathFile = path.join(UD, UDPath)
  const isExist = fs.existsSync(fullPathFile)
  if (! isExist && force) {
    throw new SystemError('reProcess: File not found')
  }

  if (isExist) {
    const FileBuffer = await fs.promises.readFile(fullPathFile)
    const updatedBuffer = await Processes[processType](FileBuffer)
    await fs.promises.rm(fullPathFile)
    await fs.promises.writeFile(fullPathFile, updatedBuffer)
  }
}

export const copyFile: (UDSrc: string, UDDist: string, newName?: string, force?: boolean)=> Promise<void> = async(UDSrc, UDDist, newName, force = true)=> {
  const fullPathFile = path.join(UD, UDSrc)
  const isExist = await fs.existsSync(fullPathFile)

  if (! isExist && force) {
    throw new SystemError('copyFile: File not found')
  }

  if (newName) {
    const splits = UDDist.split('/').reverse()
    splits[0] = newName.includes('.') ? newName : newName + path.extname(splits[0]!)
    UDDist = splits.reverse().join('/')
  }

  if (isExist) {
    await fs.promises.cp(
      fullPathFile,
      path.join(UD, UDDist)
    )
  }
}

export const removeFile: (UDPath: string, force?: boolean)=> Promise<void> = async(UDPath, force = true)=> {
  const fullPathFile = path.join(UD, UDPath)
  const isExist = await fs.existsSync(fullPathFile)

  if (! isExist && force) {
    throw new SystemError('removeFile: File not found')
  }

  if (isExist) {
    await fs.promises.rm(fullPathFile)
  }
}

export const declareFile: (file: Express.Multer.File, user: User, process: Upload.ProcessType)=> Promise<Upload> = async(file, user, process)=> {
  const newFileSchema: Upload.Declare = {
    destination: file.destination,
    filename: file.filename,
    mimetype: file.mimetype,
    process: process,
    userId: user._id!,
    directory: '/temp',
  }

  const newFile = new UploadModel(newFileSchema)
  await newFile.save()
  return newFile.toJSON();
}

export const uploadFile: (filePath: string, processType: Upload.ProcessType)=> Promise<(file: Express.Multer.File, user: User, process: Upload.ProcessType) => Promise<Upload>> = async(filePath, processType)=> {
  const exist = fs.existsSync(filePath)
  if (! exist) {
    throw new AppResponse(404)
    .setScreenMessage('File not exist', ScreenMessageType.ERROR)
  }

  const fileBuffer: Buffer = await fs.promises.readFile(filePath);
  if (!Processes[processType]) {
    throw new AppResponse(400)
      .setScreenMessage(`Unknown process type: ${processType}`, ScreenMessageType.ERROR);
  }
  const updatedBuffer = await Processes[processType](fileBuffer)

  await fs.promises.rm(filePath)
  await fs.promises.writeFile(filePath, updatedBuffer)
  return declareFile;
}

export default class SaveFile {
  declare private _staticFile: string;
  declare private _processType: string;
  declare private _requiredSavedResults: number;
  private _ignoreOldProcessType: boolean = false;
  private _listIgnoreRemove: number[] = [];
  private _saveFilesIds: ID[]         = [];
  private _saveFilesPaths: string[]   = [];
  private _removeFilesIds: ID[]       = [];
  private _removeFilesPaths: string[] = [];
  private _processTimeStart?:  number;
  private _processTimeEnd?:    number;
  private _session?: ClientSession = undefined;
  private _userId?: ID = undefined;
  private _destinationDirectory: string = 'any';

  constructor() {}

  saveFilesIds(ids: ID[]) {
    this._saveFilesIds = ids;
    return this;
  }
  saveFilesPaths(paths: string[]) {
    this._saveFilesPaths = paths;
    return this;
  }  
  removeFilesIds(ids: ID[]) {
    this._removeFilesIds = ids;
    return this;
  }
  removeFilesPaths(paths: string[]) {
    this._removeFilesPaths = paths;
    return this;
  }
  processType(processType: string) {
    this._processType = processType;
    return this;
  }
  destinationDirectory(directory: string, ymd?: boolean) {
    this._destinationDirectory = directory;
    if (ymd) this._destinationDirectory = this._destinationDirectory + Utils.YMD();
    return this;
  }
  session(session: ClientSession) {
    this._session = session;
    return this;
  }

  staticFile(filename: string) {
    this._staticFile = filename;
    return this;
  }

  setStartProcessTime(time: number) {
    this._processTimeStart = time;
    return this;
  }

  force(savedResults?: number) {
    if (savedResults) this._requiredSavedResults = savedResults;
    return this;
  }

  ignoreOldProcessType() {
    this._ignoreOldProcessType = true;
    return this;
  }
  ignoreRemoveIndexes(indexes: number[], toIndex?: number) {
    this._listIgnoreRemove = indexes;
    if (toIndex) {
      for (let a = 0; a < toIndex; a++)
        this._listIgnoreRemove.push(a)
    }
    return this;
  }

  user(userId: ID) {
    this._userId = userId;
    return this;
  }

  /**
   * - Exeute process
   * @returns {Promise<Upload.ExecuteResult>}
   */
  async Execute()  {
    let filesToRemove: HydratedDocument<Upload>[] = []
    let filesToSave: HydratedDocument<Upload>[] = []
    let filesToRemoveRusolt: PromiseSettledResult<any>[] | Upload[] = []
    let filesToSaveRusolt:   PromiseSettledResult<any>[] | Upload[] = []

    if (! this._processTimeStart) this._processTimeStart = Date.now() 

    if (this._saveFilesIds || this._saveFilesPaths) {
      filesToSave = await UploadModel.find({
        userId: this._userId,
        directory: '/temp',
        $or: [
          { filename: [...this._saveFilesPaths.map((p: string)=> p.split('/')[p.split('/').length - 1])] },
          { _id: this._saveFilesIds },
        ]
      })
    }

    if (this._removeFilesIds || this._removeFilesPaths) {
      filesToRemove = await UploadModel.find({
        userId: this._userId,
        directory: '/temp',
        $or: [
          { filename: [...this._removeFilesPaths.map((p: string)=> p.split('/')[p.split('/').length - 1])] },
          { _id: this._removeFilesIds },
        ]
      })
    }
    if (! this._ignoreOldProcessType && this._processType) {
      filesToSave.forEach((p)=> {
        if (p.process !== this._processType) {
          throw new AppResponse(400)
          .setScreenMessage(`Process Type Expected "${this.processType}"`, ScreenMessageType.ERROR)
        }
      })
    }
    if (this._staticFile) {
      if (filesToSave.length !== 1) {
        throw new SystemError('SaveFile StaticFile mode expected one file!')
      }
      if (this._processType && this._ignoreOldProcessType) {
        const file = filesToSave[0]!
        const processedBufferFile: Buffer = await Processes[this._processType as Upload.ProcessType](
          await fs.promises.readFile(path.join(UD, file.directory, file.filename))
        )
        fs.promises.writeFile(
          path.join(UD, this._destinationDirectory, this._staticFile),
          processedBufferFile
        )
      }
    }

    if (this._requiredSavedResults) {
      let exists = 0;
      for (let i = 0; i < filesToSave.length; i++) {
        const p = filesToSave[i]?.toJSON();
        if (! p || exists === this._requiredSavedResults) continue;
        if (fs.existsSync(path.join(UD, p.directory, p.filename))) 
        exists ++;
      }
       if (exists < this._requiredSavedResults) {
        throw new AppResponse(404)
        .setScreenMessage('File Deleted!', ScreenMessageType.ERROR)
      }
    }

    if (filesToSave) {
      await fs.promises.mkdir(path.join(UD, this._destinationDirectory), { recursive: true });
      await Promise.allSettled(
        filesToSave.map((p, index)=> new Promise<Upload | undefined>(async(resolve, reject)=> {
          try {
            const fileName = this._staticFile || p.filename;
            if (! fs.existsSync(path.join(UD, p.directory, p.filename))) return reject(new SystemError(`File not exists: ${path.join(UD, p.directory, p.filename)}`))
            await fs .promises.cp(
              path.join(UD, p.directory, p.filename),
              path.join(UD, this._destinationDirectory, fileName),
            )
            if (! this._listIgnoreRemove.includes(index)) {
              await fs.promises.rm(path.join(UD, p.directory, p.filename))
            }
            p.directory = this._destinationDirectory
            p.destination = path.join(UD, this._destinationDirectory)
            await p.save({session: this._session})
            resolve(p.toJSON())
          }catch(error) {reject(error)}
        }))
      )
      .then((r: any[])=> filesToSaveRusolt = r)
    }

    if (filesToRemove) {
      await Promise.allSettled(
        filesToRemove.map((p)=> new Promise<Upload | undefined>(async(resolve, reject)=> {
          try {
            await fs.promises.rm(path.join(UD, p.directory, p.filename), {})
            await p.deleteOne()
            resolve(p.toJSON())
          }catch(error) {reject(error)}
        }))
      )
      .then((r: any[])=> filesToRemoveRusolt = r)
    }

    this._processTimeEnd = Date.now()
    const result: Upload.SaveFile.ExecuteResult = {
      removed: filesToRemoveRusolt.filter((r: any)=> r.status === 'fulfilled').map((r: any)=> r.value) as Upload[],
      saved: filesToSaveRusolt    .filter((r: any)=> r.status === 'fulfilled').map((r: any)=> r.value) as Upload[],
      processTime: this._processTimeEnd! - this._processTimeStart!,
      
      getRemoved() {return this.removed},
      getSaved() {return this.saved},
      getSavedPaths() {return this.saved.map((p)=> path.join(p.directory, p.filename))}
    }
    return result;
  }
}
