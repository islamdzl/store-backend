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
  return Joi.array<Order.AcceptMany[]>()
  .has(Joi.object<Order.AcceptMany>({
    message: Joi.string().max(300).optional(),
    orderId: Joi.string().hex().length(24),
    trackingCode: Joi.string().max(100).optional()
  }))
  .validate(data) as ValidationResult<Order.AcceptMany[]>
}

export const rejectMany = (data: unknown)=> {
  return Joi.object<Order.RejectMany>({
    message: Joi.string().max(200).optional(),
    ordersIds: Joi.array().has(
      Joi.string().hex().length(24)
    )
  }).validate(data) as ValidationResult<Order.RejectMany>
}

export const setDoneMany = (data: unknown)=> {
  return Joi.array<ID[]>()
  .has(
    Joi.string().hex().length(24),
  )
  .validate(data) as ValidationResult<ID[]>
}

