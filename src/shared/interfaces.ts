import express from 'express';
import type { Types } from 'mongoose';

declare global {
  export interface Res extends express.Response {}
  export interface Req extends express.Request {
    user?: User;
    uploadFileName?: string;
  }

  export type ID = string | Types.ObjectId;

  export interface AppResponse {

    success: boolean;
    
    data?: any;

    responseFile?: {
      fileName: string;
      buffer: Buffer;
    };

    screenMessage?: {
      message: string;
      type: "INFO" | "WARN" | "ERROR";
    }

    execute?: {
      action: string;
      data: string;
    }
  }
}