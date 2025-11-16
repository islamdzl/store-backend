import Joi, {} from "joi";
export const create = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24).required()
    }).validate(data);
};
export const remove = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24),
        likeItemId: Joi.string().hex().length(24),
    }).or('productId', 'likeItemId').validate(data);
};
//# sourceMappingURL=like.validate.js.map