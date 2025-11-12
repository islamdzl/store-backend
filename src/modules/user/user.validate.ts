import Joi, { type ValidationResult } from "joi"


export const buyingDetailsValidationObject = Joi.object<User.BuyingDetails>({
  city: Joi.string().min(3).max(25).trim(),
  deliveryToHome: Joi.boolean(),
  fullName: Joi.string().min(5).max(25).trim(),
  note: Joi.string().min(0).max(300),
  phone1: Joi.string().min(9).max(11).trim(),
  phone2: Joi.string().min(9).max(11).trim().allow(''),
  postalCode: Joi.string().min(5).max(15).trim(),
  state: Joi.number().min(1).max(58)
})

export const register = (data: unknown)=> {
  return Joi.object<User.Register>({
    email:    Joi.string().email().required(),
    username:    Joi.string().min(5).max(30).required(),
    password: Joi.string().min(8).max(30).required()
  }).validate(data) as ValidationResult<User.Register>;
}

export const login = (data: unknown)=> {
  return Joi.object<User.Login>({
    email:    Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required()
  }).validate(data) as ValidationResult<User.Login>;
}

export const update = (data: unknown)=> {
  return Joi.object<User.Update>({
    buyingDetails: buyingDetailsValidationObject
  }).validate(data) as ValidationResult<Partial<User.Update>>;
}


