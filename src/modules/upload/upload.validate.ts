import Joi, { type ValidationResult } from "joi"

const processtype= [
  'ICON', 'PRODUCT_IMAGE', 'LOGO', 'BANNER'
]

export default (data: unknown)=> {
  return Joi.object<Upload.Request>({
    process: Joi.string().allow(...processtype).required()
  }).validate(data) as ValidationResult<Upload.Request>;
}