import Joi, { type ValidationResult } from "joi";

const date = ['MONTH', 'YEAR', 'DAY']

export const sellData = (data: unknown)=> {
  return Joi.object<Analyzing.Request.SellData>({
    productId: Joi.string().hex().length(24),
    date: Joi.string().valid(...date),
    skip: Joi.number().default(0)
  }).validate(data) as ValidationResult<Analyzing.Request.SellData>
}


export const profitData = (data: unknown)=> {
  return Joi.object<Analyzing.Request.ProfitData>({
    productId: Joi.string().hex().length(24),
    date: Joi.string().valid(...date),
    skip: Joi.number().default(0)
  }).validate(data) as ValidationResult<Analyzing.Request.ProfitData>
}