import fs from 'fs';
import UploadModel from './upload.model.js';
import logger from "../../shared/logger.js";
import path from 'path';
let timeOut;
export default function main() {
    timeOut = Number(process.env.CLEAN_TEMP_DIRECTORY_TIME);
    if (!process.env.CLEAN_TEMP_DIRECTORY_TIME) {
        logger.warn('[.ENV]: CLEAN_TEMP_DIRECTORY_TIME is not define');
        timeOut = 1000 * 60 * 5;
    }
    cheskAndDelete();
    setInterval(cheskAndDelete, timeOut);
}
const cheskAndDelete = async () => {
    const dateFilter = new Date(Date.now() - timeOut);
    const docs = await UploadModel.find({
        directory: '/temp',
        createdAt: {
            $lte: dateFilter
        }
    });
    const promises = docs
        .filter(async (d) => fs.existsSync(path.join(d.destination, d.filename)))
        .map((d) => fs.promises.rm(path.join(d.destination, d.filename), { force: true }));
    await UploadModel.deleteMany({
        directory: '/temp',
        createdAt: {
            $lte: dateFilter
        }
    });
    await Promise.allSettled(promises);
};
//# sourceMappingURL=upload.job.js.map