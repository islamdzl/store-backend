import multer from 'multer';
import * as uuid from 'uuid'
import fs from 'fs';
import { TD } from '../shared/statics.js'

const diskStorage = multer.diskStorage({
  destination: (req, file, cb)=> {
    if (! fs.existsSync(TD)) {
      fs.mkdirSync(TD)
    }
    cb(null, TD)
  },
  filename: (req: Req, file, cb)=> {
    const fileName = uuid.v4() + `.${file.originalname.split('.').reverse()[0]}`
    req.uploadFileName = fileName;
    file.filename = fileName;
    cb(null, fileName)
  }
})

const images = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb)=> {
    if (file.mimetype.split('/')[0] === 'image') {
      return cb(null, true)
    }
    cb(null, false)
  },
})


export const Images = images;