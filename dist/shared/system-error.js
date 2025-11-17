import logger from "./logger.js";
export default class SystemError extends Error {
    static ErrorType = "SYSTEM_ERROR";
    constructor(message) {
        super(message);
        this.message = message;
    }
    logDebug(debug) {
        logger.debug(debug);
    }
    exit(statu) {
        process.exit(statu);
    }
}
export const catchSystemError = (error, source) => {
    if (error instanceof SystemError) {
        logger.error({
            source, message: error.message,
            stack: error.stack
        });
        return;
    }
    throw error;
};
//# sourceMappingURL=system-error.js.map