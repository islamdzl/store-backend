import type { ClientSession } from "mongoose";
import mongoose from "mongoose";
import StoreService from "../modules/store/store.service.js";

export const isAdmin = async(email: string)=> {
  const admins: string[] = [...JSON.parse(process.env.ADMINS || "[]"), ...await StoreService.getAdminsList()];
  return admins.includes(email);
}

export const getSystemSuperAdmins: ()=> string[] = ()=> {
  return JSON.parse(process.env.ADMINS || "[]")
}

export const withSession: <T>(callBack: ((session: ClientSession)=> Promise<T>))=> Promise<T> = async(callBack)=> {

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const result = await callBack(session)
    await session.commitTransaction()
    return result;
  }
  catch(error) {
    await session.abortTransaction()
    throw error;
  }
  finally {
    await session.endSession()
  }
}