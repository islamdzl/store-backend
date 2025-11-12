import Joi from "joi"

const sort = [
  'HOT',
  'NEW',
  'BUY',
]

export const explore = (data: unknown)=> {
  return Joi.object<Search.Explore>({
    keyWord: Joi.string().min(3).max(20).allow(null),
    limit: Joi.number().min(3).max(100).required(),
    skip: Joi.number().min(0).required(),
    sort: Joi.string().valid(...sort).required(),
    classification: Joi.object<Product.Classification>({
      category: Joi.string().hex().length(24).required(),
      branch: Joi.string().hex().length(24).allow(null),
    }).optional()
  }).validate(data)
}