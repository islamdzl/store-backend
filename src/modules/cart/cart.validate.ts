import Joi, { type ValidationResult } from "joi";

export const addProduct = (data: unknown)=> {
  return Joi.object<Cart.AddItem>({
    count: Joi.number().min(1).max(100).required(),
    productId: Joi.string().hex().length(24).required(),
  }).validate(data) as ValidationResult<Cart.AddItem>
}

export const removeProduct = (data: unknown)=> {
  return Joi.object<Cart.RemoveItem>({
    productId: Joi.string().hex().length(24).required(),
  }).validate(data) as ValidationResult<Cart.RemoveItem>
}

export const encrement = (data: unknown)=> {
  return Joi.object<Cart.Encrement>({
    cartItemId: Joi.string().hex().length(24).required(),
  }).validate(data) as ValidationResult<Cart.Encrement>
}

export const decrement = (data: unknown)=> {
  return Joi.object<Cart.Decrement>({
    cartItemId: Joi.string().hex().length(24).required(),
  }).validate(data) as ValidationResult<Cart.Decrement>
}