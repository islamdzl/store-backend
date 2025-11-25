import Joi, { type ValidationResult } from "joi"

interface IGetStore {
  skip: number;
  limit: number;
}

interface IOrderId {
  orderId: ID;
}

export const orderId = (data: unknown)=> {
  return Joi.object<IOrderId>({
    orderId: Joi.string().hex().length(24),
  }).validate(data) as ValidationResult<IOrderId>
}

export const getStore = (data: unknown)=> {
  return Joi.object<IGetStore>({
    limit: Joi.number().min(0),
    skip: Joi.number().min(0),
  }).validate(data) as ValidationResult<IGetStore>
}

export const acceptMany = (data: unknown)=> {
  return Joi.array<Order.Request.AcceptMany[]>()
  .items(Joi.object<Order.Request.AcceptMany>({
    message: Joi.string().max(300).optional(),
    orderId: Joi.string().hex().length(24),
    trackingCode: Joi.string().max(100).allow('')
  }))
  .validate(data) as ValidationResult<Order.Request.AcceptMany[]>
}

export const rejectMany = (data: unknown)=> {
  return Joi.object<Order.Request.RejectMany>({
    message: Joi.string().max(200).optional(),
    ordersIds: Joi.array().has(
      Joi.string().hex().length(24)
    )
  }).validate(data) as ValidationResult<Order.Request.RejectMany>
}

export const setDoneMany = (data: unknown)=> {
  return Joi.array<ID[]>()
  .has(
    Joi.string().hex().length(24),
  )
  .validate(data) as ValidationResult<ID[]>
}

