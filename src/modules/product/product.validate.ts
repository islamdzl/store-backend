import Joi, { type ValidationResult } from "joi";
import { buyingDetailsValidationObject } from '../user/user.validate.js'

export const create = (data: unknown)=> {
  return Joi.object<Product.Create>({
    name: Joi.string().min(3).max(25).required(),
    price: Joi.number().min(0).max(999999999).required(),
    description: Joi.string().min(0).max(300).optional(),
    isActive: Joi.boolean().default(true),
    quantity: Joi.number().min(1).max(999999).allow(null),
    delivery: Joi.number().min(0).allow(null),
    classification: Joi.object<Product.Classification>({
      category: Joi.string().hex().length(24).required(),
      branch: Joi.string().hex().length(24).allow(null),
    }), 
    images: Joi.array().min(1).max(50).required().has(
      Joi.string().hex().length(24)
    ),
    keyVal: Joi.array().items(
      Joi.object<Product.KeyVal>({
        key: Joi.string().min(2).max(20).required(),
        val: Joi.string().min(1).max(70).required()
      }).optional()
    ).min(0).default([]),
  }).validate(data) as ValidationResult<Product.Create>
}

export const update = (data: unknown)=> {
  return Joi.object<Product.Update>({
    productId: Joi.string().hex().length(24).required(),
    name: Joi.string().min(3).max(25).required(),
    price: Joi.number().min(0).max(999999999).required(),
    description: Joi.string().max(300).min(0),
    promo: Joi.number().min(0).max(99999999).allow(null),
    isActive: Joi.boolean(),
    quantity: Joi.number().min(1).max(999999).allow(null),
    delivery: Joi.number().min(0).allow(null),
    images: Joi.array().items(
      Joi.object<Product.Image>({
        _id: Joi.string().hex().length(24).optional(),
        type: Joi.string().valid('old', 'new').required(),
        url: Joi.string().min(15).max(70).required()
      })
    ).min(1),
    classification: Joi.object<Product.Classification>({
      category: Joi.string().hex().length(24).required(),
      branch: Joi.string().hex().length(24).required(),
    }).optional(),
    keyVal: Joi.array().items(
      Joi.object<Product.KeyVal>({
        key: Joi.string().min(2).max(20).required(),
        val: Joi.string().min(1).max(70).required()
      }).optional()
    ).min(0).default([]),
  }).validate(data) as ValidationResult<Product.Update>
}

export const buy = (data: unknown)=> {
  return Joi.object<Product.Buy>({
    productId: Joi.string().hex().length(24),
    count: Joi.number().min(0).max(9999),
    buyingDetails: buyingDetailsValidationObject.optional(),
  }).validate(data) as ValidationResult<Product.Buy>
}

export const productId = (data: unknown)=> {
  return Joi.object<{productId: string}>({
    productId: Joi.string().hex().length(24).required()
  }).validate(data) as ValidationResult<{productId: string}> 
}