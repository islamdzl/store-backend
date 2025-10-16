import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import logger from './logger.js';
import AppResponse, { ScreenMessageType } from './app-response.js';

const hashSalt = 13;

if (! process.env.JWT_SECRET) {
  logger.warn('[.ENV]: JWT_SECRET is required')
}

const JWTSecretKey = process.env.JWT_SECRET || 'SECRET_KEY';

declare global {
  interface IJWTPayload {
    _id: string | Types.ObjectId
  }
}



export const YMD = (before?: string, after?: string)=> {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0'); 
  return `/${ before ? '/' + before + year : year}/${month}/${day}/${after ? '/' + after : ''}`;
}

export const hashPassword: (rowPassword: string)=> Promise<string> = async(rowPassword)=> {
  return await bcrypt.hash(rowPassword, hashSalt);
}

export const verifyPassword: (password: string, hashedPassword: string)=> Promise<boolean> = async(password, hashedPassword)=> {
  return await bcrypt.compare(password, hashedPassword);
}

export const jwtSign = (payload: IJWTPayload)=> {
  return jwt.sign(payload, JWTSecretKey, {expiresIn: '30d'})
}

export const jwtVerify = (token: string)=> {
  return new Promise<IJWTPayload>((resolve, reject)=> {
    jwt.verify(token, JWTSecretKey, (error, payload)=> {
      if (error) {
        return reject(
          new AppResponse(400)
          .setScreenMessage('please ReLogin', ScreenMessageType.WARN)
          .reLogIn()
        )
      }
      resolve(payload as IJWTPayload)
    })
  })
}
