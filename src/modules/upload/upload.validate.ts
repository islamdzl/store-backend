import Joi, { type ValidationResult } from "joi"


export default (data: unknown)=> {
  return Joi.object<Upload.Request>({
    process: Joi.string().allow(Upload.ProcessType).required()
  }).validate(data) as ValidationResult<Upload.Request>;
}