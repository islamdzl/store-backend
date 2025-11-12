import Joi, { type ValidationResult } from "joi"


export const create = (data: unknown)=> {
  return Joi.object<Like.Create>({
    productId: Joi.string().hex().length(24).required()
  }).validate(data) as ValidationResult<Like.Create>
}

export const remove = (data: unknown)=> {
  return Joi.object<Like.Remove>({
    productId: Joi.string().hex().length(24),
    likeItemId: Joi.string().hex().length(24),
  }).or('productId', 'likeItemId').validate(data) as ValidationResult<Like.Remove>
}