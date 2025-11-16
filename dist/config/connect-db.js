import mongoose from "mongoose";
import SystemError from "../shared/system-error.js";
import logger from "../shared/logger.js";
const connect = async () => {
    if (!process.env.DATABASE_URL) {
        throw new SystemError('[.ENV] Invalid "DATABASE_URL"');
    }
    await mongoose.connect(process.env.DATABASE_URL, {
        tls: true, // تفعيل TLS
        tlsAllowInvalidCertificates: false, // لا تسمح بشهادات غير صالحة
        tlsCAFile: '/etc/ssl/certs/ca-certificates.crt', // مسار الشهادات على Render
    })
        .then(() => logger.info('[DATABASE]: Connected Successfully'))
        .catch(err => {
        logger.error('[DATABASE]: Connection Failed', err);
        process.exit(1);
    });
};
mongoose.connection.on('disconnected', () => {
    logger.warn('[DATABASE]: Connection lost, reconnecting...');
    connect();
});
mongoose.connection.on('reconnected', () => {
    logger.warn('[DATABASE]: Reconnected');
});
export default connect;
//# sourceMappingURL=connect-db.js.map