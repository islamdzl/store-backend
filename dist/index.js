import dotenv from 'dotenv';
import path from 'path';
import logger from './shared/logger.js';
import connectDb from './config/connect-db.js';
import SystemError from './shared/system-error.js';
import * as application from './app.js';
dotenv.config({
    path: path.join(process.cwd(), '.env')
});
const PORT = Number(process.env.PORT) || 2007;
process.on("uncaughtException", (err) => {
    logger.error(`"UNCAUGHT EXCEPTION:${err}`);
});
process.on("unhandledRejection", (reason) => {
    logger.error(`UNHANDLED REJECTION: ${reason}`);
});
logger.info("STARTING BACKEND...");
try {
    const app = application.default;
    logger.info(`Try running in port: ${PORT}`);
    app.listen(PORT, async () => {
        logger.info(`Server listen in port: ${PORT}`);
        await connectDb();
    });
}
catch (e) {
    if (e instanceof SystemError) {
        logger.error(`System Error: ${e.stack}\n> ${e.message}`);
        e.exit(0);
    }
    logger.error({
        message: 'Error in Running app',
        error: e.message
    });
}
//# sourceMappingURL=index.js.map