import Joi, {} from "joi";
export const orderId = (data) => {
    return Joi.object({
        orderId: Joi.string().hex().length(24),
    }).validate(data);
};
export const getStore = (data) => {
    return Joi.object({
        limit: Joi.number().min(0),
        skip: Joi.number().min(0),
    }).validate(data);
};
export const acceptMany = (data) => {
    return Joi.array()
        .items(Joi.object({
        message: Joi.string().max(300).optional(),
        orderId: Joi.string().hex().length(24),
        trackingCode: Joi.string().max(100).allow('')
    }))
        .validate(data);
};
export const rejectMany = (data) => {
    return Joi.object({
        message: Joi.string().max(200).optional(),
        ordersIds: Joi.array().has(Joi.string().hex().length(24))
    }).validate(data);
};
export const setDoneMany = (data) => {
    return Joi.array()
        .has(Joi.string().hex().length(24))
        .validate(data);
};
//# sourceMappingURL=order.validate.js.map