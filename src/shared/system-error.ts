import logger from "./logger.js";


export default class SystemError extends Error {
  static ErrorType: string = "SYSTEM_ERROR";

  constructor(message: string) {
    super(message)
    this.message = message;
  }

  logDebug(debug: any) {
    logger.debug(debug);
  }

  exit(statu: number) {
    process.exit(statu)
  }
}

export const catchSystemError = (error: any, source: string)=> {
  if (error instanceof SystemError) {
    logger.error({
      source, message: error.message,
      stack: error.stack
    })
    return;
  }

  throw error;
}