import multer from 'multer';
import path from 'path';
import * as uuid from 'uuid'

const diskStorage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, path.join(process.cwd(), 'uploads/temp'))
  },
  filename: (req: Req, file, cb)=> {
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