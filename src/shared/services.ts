import type { ClientSession } from "mongoose";
import mongoose from "mongoose";

export const isAdmin = (email: string)=> {
  const admins: string[] = JSON.parse(process.env.ADMINS || "[]");
  return admins.includes(email);
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