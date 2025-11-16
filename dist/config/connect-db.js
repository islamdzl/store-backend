import mongoose from "mongoose";
import SystemError from "../shared/system-error.js";
import logger from "../shared/logger.js";
const connect = async () => {
    if (!process.env.DATABASE_URL) {
        throw new SystemError('[.ENV] Invalid "DATABASE_URL"');
    }
    await mongoose.connect(process.env.DATABASE_URL, {})
        .then(() => logger.info('[DATABASE]: Connected Successfully'));
};
mongoose.connection.on('disconnected', () => {
    logger.warn('[DATABASE]: Connection is lost');
    connect();
});
mongoose.connection.on('reconnected', () => {
    logger.warn('[DATABASE]: Reconection...');
});
export default connect;
//# sourceMappingURL=connect-db.js.map