import express from 'express'
import logger from './logger.js';
import SystemError, { catchSystemError } from './system-error.js';

export enum ScreenMessageType {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}
export default class AppResponse extends Error {
  private response: AppResponse | any = {};

  constructor(statuCode: number) {
    super('')
    this.response.statuCode = statuCode;
  }

  public reLogIn() {
    this.response.execute = {
      action: "redirect",
      data: "/login"
    }
    return this;
  }

  public setScreenMessage(message: string, type: ScreenMessageType) {
    this.response.screenMessage = {
      message, type
    }
    return this;
  }

  public setResponseFile(buffer: Buffer, fileName: string) {
    this.response.responseFile = {
      buffer, fileName
    }
    return this;
  }

  public runCommand(command: string, data: any) {
    this.response.execute = {
      data, action: command
    }
    return this;
  }

  public setData(data: any) {
    this.response.data = data;
    return this;
  } 


  public Execute(res: express.Response) {
    res.status(this.response.statuCode);
    const response: AppResponse = {
      success: (this.response.statuCode <= 300),
      ...this.response
    };
    try {
      res.json(response);
      return false;
    }catch(e){ return e}
  }

}

export const useAppResponse = (res: Res, response: any)=> {

  if (response instanceof AppResponse) {
    
    const error = response.Execute(res);
    if (error) {
      logger.error({ message: 'Error in Execute AppResponse', error });
    }
  }
}

export const catchAppError = (error: any, res: Res, source?: string)=> {

  if (error instanceof AppResponse) {
    error.Execute(res)
    return;
  }

  useAppResponse(
    res,
    new AppResponse(500)
    .setScreenMessage('System Error', ScreenMessageType.ERROR)
  )
  if (source) {
    catchSystemError(error, source)
  }
}