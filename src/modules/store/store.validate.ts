import Joi from "joi";

export interface IUserRequest_GET {

}

export const get = (data: unknown)=> {
  return Joi.object<IUserRequest_GET>({
  }).validate(data);
}

export const update = (data: unknown)=> {
  return Joi.object<Store.Update>({
    name: Joi.string().trim().min(3).max(20),
    description: Joi.string().max(300),
    logo: Joi.string().hex().length(24),
    banner: Joi.string().hex().length(24),
    contact: Joi.object<Store.Contact>({
      email: Joi.string().email(),
      location: Joi.string().min(10).max(50),
      phone1: Joi.string().min(9).max(11),
      phone2: Joi.string().min(9).max(11),
    }),
    media: Joi.object<Store.Media>({
      facebook: Joi.string().min(10).max(100),
      instagram: Joi.string().min(10).max(100),
      tiktok: Joi.string().min(10).max(100),
    }),
    private: Joi.object({
      admins: Joi.array().items(Joi.string().email()),
      pixels: Joi.object<Store.Pixels>({
        facebook: Joi.array().items(Joi.string()).min(0).max(10),
        tiktok: Joi.array().items(Joi.string()).min(0).max(10)
      }),
    })
  }).validate(data);
}