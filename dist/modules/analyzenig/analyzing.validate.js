import Joi, {} from "joi";
const date = ['MONTH', 'YEAR', 'DATA'];
export const sellData = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24),
        date: Joi.string().allow(...date),
        skip: Joi.number().default(0)
    }).validate(data);
};
export const profitData = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24),
        date: Joi.string().allow(...date),
        skip: Joi.number().default(0)
    }).validate(data);
};
//# sourceMappingURL=analyzing.validate.js.map