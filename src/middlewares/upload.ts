import multer from 'multer';
import path from 'path';
import * as uuid from 'uuid'
import * as Interfaces from '../shared/interfaces.js'

const diskStorage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: (req: Interfaces.Req, file, cb)=> {
    const fileName = uuid.v4() + `.${file.originalname.split('.').reverse()[0]}`
    req.uploadFileName = fileName;
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


export default images.single('image')