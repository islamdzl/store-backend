import AppResponse, { ScreenMessageType } from '../../shared/app-response.js'
import UploadModel from './upload.model.js'
import * as Utils from '../../shared/utils.js'
import sharp from 'sharp'
import fs from 'fs'
import type { ClientSession } from 'mongoose';
import path from 'path';
import { v4 } from 'uuid'
import SystemError from '../../shared/system-error.js'

const uploadDir = path.join(process.cwd(), 'upload')

class Processes {
  public static async LOGO(buffer: Buffer) {
    return await sharp(buffer)
      .resize(512, 512, { fit: 'contain' })
      .jpeg({ quality: 85 })
      .toBuffer();
  } 
}


export const declareFile: (file: Express.Multer.File, user: User, process: Upload.ProcessType, session?: ClientSession)=> Promise<void> = async(file, user, process, session)=> {
  const newFileSchema: Upload = {
    destination: file.destination,
    filename: file.filename,
    mimetype: file.mimetype,
    process: process,
    userId: user._id,
    size: file.size,
    directory: '',
    path: '',
  }

  const newFile = new UploadModel(newFileSchema)
  await newFile.save({session})
}

export const uploadFile: (filePath: string, processType: Upload.ProcessType, force?: boolean)=> Promise<void> = async(filePath, processType, force)=> {
  const exist = fs.existsSync(filePath)
  if (! exist && force) {
    throw new AppResponse(404)
    .setScreenMessage('File not exist', ScreenMessageType.ERROR)
  }

  if (exist) {
    const fileBuffer: Buffer = await fs.promises.readFile(filePath);
    if (!Processes[processType]) {
      throw new AppResponse(400)
        .setScreenMessage(`Unknown process type: ${processType}`, ScreenMessageType.ERROR);
    }
    const updatedBuffer = await Processes[processType](fileBuffer)

    await fs.promises.rm(filePath)
    await fs.promises.writeFile(filePath, updatedBuffer)
  }
}

export default class SaveFile {
  declare private session: ClientSession;
  declare private staticFileName: string;
  declare private replacesPaths: string[];
  declare private pathsToFindIds: string[];
  private filesIds: ID[] = [];
  private directory: string = 'temp';
  constructor(filesIds: ID[] | null) {
    if (filesIds) {
      this.filesIds = filesIds;
    }
  }

  findByPath(pathsToFindIds: string[]) {
    this.pathsToFindIds = pathsToFindIds;
    return this;
  }

  distinationDir(directory: string) {
    this.directory = directory;
    return this;
  }

  replace(filesPaths: string[]) {
    this.replacesPaths = filesPaths;
    return this;
  }

  setSession(session: ClientSession) {
    this.session = session;
    return this;
  }

  setStaticFileName(filename: string) {
    this.staticFileName = filename;
    return this;
  }

  async remove(filesPaths: string[]) {
    await UploadModel.deleteMany({path: filesPaths})
    await Promise.all(
      filesPaths.filter((p)=> fs.existsSync(path.join(uploadDir, p)))
      .map((p)=> fs.promises.rm(path.join(uploadDir, p), {force: true}))
    )
  }

  /**
   * 
   * @param userId 
   * @param force 
   * @returns {Promise<Upload.ExecuteResult>}
   */
  async Execute(userId?: ID, force?: boolean)  {
    if (! this.filesIds && this.pathsToFindIds) {
      const payload = await UploadModel.find({path: this.pathsToFindIds})
      if (payload) this.filesIds = payload.map((p)=> p._id);
    }

    if (this.staticFileName && this.filesIds.length !== 1) {
      throw new SystemError('The "SaveFile" Expecte One File: Upload Services')
    }

    const payloads = await UploadModel.find({_id: this.filesIds, userId})
    if (! payloads || ! this.filesIds.length) {
      if (force) {
        throw new AppResponse(404)
        .setScreenMessage('File Not Found', ScreenMessageType.ERROR)
      }
      return [] as Upload.ExecuteResult[];
    }

    if (this.replacesPaths && this.replacesPaths.length) {
      const pathsToDelete = await UploadModel.find({path: this.replacesPaths})
      .lean()
      .exec()
      const payloadsToRemove: ID[] = []
      await Promise.allSettled(
        pathsToDelete.map(async (f)=> {
          if (fs.existsSync(path.join(uploadDir, f.path))) {
            payloadsToRemove.push(f._id)
            return fs.promises.rm(path.join(uploadDir, f.path), {force: true})
          }
        })
      )
      await UploadModel.deleteMany({_id: payloadsToRemove}, {session: this.session})
    }

    const results = await Promise.all(
      payloads.map(async(p)=> {
        if (fs.existsSync(path.join(uploadDir, p.destination))) {
          const newFileName = this.staticFileName || (v4() + path.extname(p.filename));
          const newFileDir  = this.staticFileName ? ('/' + this.directory ): Utils.YMD(this.directory);
          const newFile = new UploadModel({...p.toJSON(), ...{
            path: '/' + path.join(newFileDir, newFileName),
            directory: this.directory
          }})
          if (! fs.existsSync(path.join(uploadDir, newFileDir))) {
            await fs.promises.mkdir(path.join(uploadDir, newFileDir), {recursive: true})
          }
          await fs.promises.rename(
            path.join(uploadDir, p.destination),
            path.join(uploadDir, newFileDir, newFileName)
          );
          await newFile.save({session: this.session})
          const result: Upload.ExecuteResult = {
            id: newFile._id,
            path: '/' + path.join(newFileDir, newFileName)
          }
          return result;
        }
      })
    )
    return results;
  }

}
