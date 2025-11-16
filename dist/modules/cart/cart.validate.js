import Joi, {} from "joi";
export const addProduct = (data) => {
    return Joi.object({
        count: Joi.number().min(1).max(100).required(),
        productId: Joi.string().hex().length(24).required(),
    }).validate(data);
};
export const removeProduct = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24),
        cartItemId: Joi.string().hex().length(24),
    }).or('productId', 'cartItemId').validate(data);
};
export const encrement = (data) => {
    return Joi.object({
        cartItemId: Joi.string().hex().length(24).required(),
    }).validate(data);
};
export const decrement = (data) => {
    return Joi.object({
        cartItemId: Joi.string().hex().length(24).required(),
    }).validate(data);
};
//# sourceMappingURL=cart.validate.js.map