import Joi, { type ValidationResult } from "joi";
import { buyingDetailsValidationObject } from '../user/user.validate.js'

export const create = (data: unknown)=> {
  return Joi.object<Product.Request.Create>({
    name: Joi.string().trim().min(3).max(25).required(),
    price: Joi.number().min(0).max(999999999).required(),
    description: Joi.string().min(0).max(3500).optional().allow(null),
    isActive: Joi.boolean().default(true),
    quantity: Joi.number().min(1).max(999999).optional().allow(null),
    delivery: Joi.number().min(0).allow(null),
    classification: Joi.object<Product.Classification>({
      category: Joi.string().hex().length(24).required(),
      branch: Joi.string().hex().length(24).allow(null),
    }), 
    images: Joi.array().min(1).max(50).required().has(
      Joi.string().hex().length(24)
    ),
    colors: Joi.array().items(Joi.string()).max(50).optional().allow(null),
    types: Joi.array().items(
      Joi.object<Product.Type>({
        typeName: Joi.string().max(30),
        values: Joi.array().items(Joi.string())
      })
    ).optional().allow(null),
    keyVal: Joi.array().items(
      Joi.object<Product.KeyVal>({
        key: Joi.string().min(2).max(100).required(),
        val: Joi.string().min(1).max(300).required()
      }).optional()
    ).min(0).default([]),
  })
  .strict()
  .validate(data) as ValidationResult<Product.Request.Create>
}

export const update = (data: unknown)=> {
  return Joi.object<Product.Request.Update>({
    productId: Joi.string().hex().length(24).required(),
    name: Joi.string().trim().min(3).max(25).optional(),
    price: Joi.number().min(0).max(999999999).optional(),
    description: Joi.string().max(3500).min(0).optional(),
    promo: Joi.number().min(0).max(99999999).optional().allow(null),
    isActive: Joi.boolean().optional(),
    quantity: Joi.number().min(1).max(999999).optional().allow(null),
    delivery: Joi.number().min(0).optional().allow(null),
    images: Joi.array().items(
      Joi.object<Product.Request.Update.Image>({
        _id: Joi.string().hex().length(24).optional(),
        type: Joi.string().valid('old', 'new').required(),
        url: Joi.string().min(15).max(70).required()
      })
    ).min(1).max(70).optional(),
    classification: Joi.object<Product.Classification>({
      category: Joi.string().hex().length(24).required(),
      branch: Joi.string().hex().length(24).optional().allow(null)
    }).optional().allow(null),
    colors: Joi.array().items(Joi.string()).max(50).optional().allow(null),
    types: Joi.array().items(
      Joi.object<Product.Type>({
        typeName: Joi.string().max(30),
        values: Joi.array().items(Joi.string())
      })
    ).optional().allow(null),
    keyVal: Joi.array().items(
      Joi.object<Product.KeyVal>({
        key: Joi.string().min(2).max(100).required(),
        val: Joi.string().min(1).max(300).required()
      }).optional()
    ).min(0).optional(),

  })
  .strict()
  .validate(data) as ValidationResult<Product.Request.Update>
}


export const buy = (data: unknown)=> {
  return Joi.object<Product.Request.Buy>({
    productId: Joi.string().hex().length(24).required(),
    count: Joi.number().min(0).max(9999).required(),
    buyingDetails: buyingDetailsValidationObject.optional(),
    color: Joi.string().optional().allow(null),
    types: Joi.array().items(
      Joi.object<Product.Request.Buy.Type>({
      typeName: Joi.string().max(30),
      selectedIndex: Joi.number().min(0),
    })
    )
  }).validate(data) as ValidationResult<Product.Request.Buy>
}

export const productId = (data: unknown)=> {
  return Joi.object<{productId: string}>({
    productId: Joi.string().hex().length(24).required()
  }).validate(data) as ValidationResult<{productId: string}> 
}


export const byeAll = (data: unknown)=> {
  return Joi.object<Cart.Request.ByeAll>({
    buyingDetails: buyingDetailsValidationObject,
    products: Joi.array().items(
      Joi.object<Cart.Request.Bye.Product>({
        productId: Joi.string().hex().length(24).required(),
        count: Joi.number().min(1).max(1000).required(),
        color: Joi.number().optional(),
        types: Joi.array().min(0).items(
          Joi.object<Product.Request.Buy.Type>({
            selectedIndex: Joi.number().min(0),
            typeName: Joi.string().min(1).max(60)
          })
        )
      })
    ).min(1).max(100)
  }).validate(data) as ValidationResult<Cart.Request.ByeAll>
}