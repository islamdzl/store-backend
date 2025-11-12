import type { ClientSession, HydratedDocument } from 'mongoose'
import UserModel from './user.model.js'
import * as Utils from '../../shared/utils.js'
import * as Services from '../../shared/services.js'
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js'

export const create: (info: Partial<User>, session?: ClientSession)=> Promise<HydratedDocument<User>> = async(info, session)=> {
  const newUser = new UserModel(info)
  await newUser.save({session})
  return newUser;
}


export const ifExist: (condition: Partial<User>)=> Promise<boolean> = async(condition)=> {
  const user = await UserModel.findOne(condition, {_id: 1});
  return user ? true : false;
}


export const loginResponse: (user: User)=> User.LoginResponse = (user)=> {

  const jwtPayload: IJWTPayload = {
    _id: user._id
  }

  const token = Utils.jwtSign(jwtPayload)
  const loginResponse: User.LoginResponse = {
    email: user.email,
    picture: user.picture,
    username: user.username,
    isAdmin: Services.isAdmin(user.email),
    token
  }
  return loginResponse;
}


export const getUserByEmail: (email: string, force?: boolean)=> Promise<HydratedDocument<User> | null> = async(email, force)=> {
  const user = await UserModel.findOne({email});

  if (! user && force) {
    throw new AppResponse(404)
    .setScreenMessage('Account not found', ScreenMessageType.ERROR)
  }
  return user;
}

export const deleteAccount: (userId: ID)=> Promise<void> = async(userId)=> {
  const userToDelete = UserModel.findByIdAndDelete(userId);
  if (! userToDelete) {
    throw new AppResponse(404)
    .setScreenMessage('Account not found to delete', ScreenMessageType.ERROR)
  }
}

export const getUser: (userId: ID, force?: boolean)=> Promise<HydratedDocument<User> | null> = async(userId, force)=> {
  const user = await UserModel.findById(userId)

  if (! user) {
    if (force) {
      throw new AppResponse(404)
      .setScreenMessage('User not found', ScreenMessageType.ERROR)
    }
    return null;
  }

  return user;
}

export const update: (userId: ID, newUser: Partial<User.Update>)=> Promise<User> = async(userId, newUser)=> {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, {
    $set: newUser
  })
  if (! updatedUser) {
    throw new AppResponse(404)
    .setScreenMessage('User not found', ScreenMessageType.ERROR)
  }
  return updatedUser.toJSON()
} 