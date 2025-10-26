import Joi, { type ValidationResult } from "joi";
import { buyingDetailsValidationObject } from '../user/user.validate.js'

export const create = (data: unknown)=> {
  return Joi.object<Product.Create>({
    name: Joi.string().min(3).max(25).required(),
    price: Joi.number().min(0).max(999999999).required(),
    description: Joi.string().max(300).optional(),
    contity: Joi.number().max(30000).optional(),
    isActive: Joi.boolean().default(true),
    branchId: Joi.string().hex().length(24).required(),
    images: Joi.array().min(1).max(50).required().has(
      Joi.string().uuid()
    ),
  }).validate(data) as ValidationResult<Product.Create>
}

export const update = (data: unknown)=> {
  return Joi.object<Product.Update>({
    productId: Joi.string().hex().length(24).required(),
    name: Joi.string().min(3).max(25).required(),
    price: Joi.number().min(0).max(999999999).required(),
    description: Joi.string().max(300).optional(),
    contity: Joi.number().min(-1).max(999999).default(-1),
    promo: Joi.number().min(1).max(99999999),
    isActive: Joi.boolean(),
    AImages: Joi.array().max(50).required().has(
      Joi.string().uuid()
    ),
    RImages: Joi.array().max(50).required().has(
      Joi.string().min(20).max(100)
    ),
    classification: Joi.object<Product.Classification>({
      category: Joi.string().hex().length(24).required(),
      branch: Joi.string().hex().length(24).required(),
    }).optional()
  }).validate(data) as ValidationResult<Product.Update>
}

export const buy = (data: unknown)=> {
  return Joi.object<Product.Buy>({
    productId: Joi.string().hex().length(24),
    count: Joi.number().min(0).max(9999),
    buyingDetails: buyingDetailsValidationObject.optional(),
  }).validate(data) as ValidationResult<Product.Buy>
}