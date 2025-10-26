import Joi from "joi"



export const explore = (data: unknown)=> {
  return Joi.object<Search.Explore>({
    keyWord: Joi.string().min(3).max(20).optional(),
    limit: Joi.number().min(10).max(100).required(),
    skip: Joi.number().min(0).required(),
    sort: Joi.string().valid(Search.Sort).required(),
    classification: Joi.object<Product.Classification>({
      category: Joi.string().hex().length(24).required(),
      branch: Joi.string().hex().length(24).optional(),
    }).optional()
  }).validate(data)
}