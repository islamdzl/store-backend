import Joi from "joi";

export interface IUserRequest_GET {

}

export const get = (data: unknown)=> {
  return Joi.object<IUserRequest_GET>({

  }).validate(data);
}

export interface IUserRequest_UPDATE extends Partial<Store> {
  banner: string;
  logo: string;
}

export const update = (data: unknown)=> {
  return Joi.object<IUserRequest_UPDATE>({
    name: Joi.string().trim().min(3).max(20),
    description: Joi.string().max(300),
  }).validate(data);
}