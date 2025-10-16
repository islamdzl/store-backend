import Joi, { type ValidationResult } from "joi";

export const addProduct = (data: unknown)=> {
  return Joi.object<Cart.RequestAddItem>({
    count: Joi.number().min(1).max(100).required(),
    productId: Joi.string().hex().length(24).required(),
  }).validate(data) as ValidationResult<Cart.RequestAddItem>
}

export const removeProduct = (data: unknown)=> {
  return Joi.object<Cart.RequestRemoveItem>({
    productId: Joi.string().hex().length(24).required(),
  }).validate(data) as ValidationResult<Cart.RequestRemoveItem>
}