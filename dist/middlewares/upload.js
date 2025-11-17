import multer from 'multer';
import path from 'path';
import * as uuid from 'uuid';
import fs from 'fs';
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('milter 1');
        if (!fs.existsSync(path.join(process.cwd(), 'uploads/temp'))) {
            console.log('milter 2');
            fs.mkdirSync(path.join(process.cwd(), 'uploads/temp'));
        }
        console.log('milter 3');
        cb(null, path.join(process.cwd(), 'uploads/temp'));
    },
    filename: (req, file, cb) => {
        const fileName = uuid.v4() + `.${file.originalname.split('.').reverse()[0]}`;
        req.uploadFileName = fileName;
        file.filename = fileName;
        cb(null, fileName);
    }
});
const images = multer({
    storage: diskStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.split('/')[0] === 'image') {
            return cb(null, true);
        }
        cb(null, false);
    },
});
export const Images = images;
//# sourceMappingURL=upload.js.map