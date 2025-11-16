import Joi from "joi";
const sort = [
    'HOT',
    'NEW',
    'BUY',
];
export const explore = (data) => {
    return Joi.object({
        keyWord: Joi.string().min(3).max(20).allow(null),
        limit: Joi.number().min(3).max(100).required(),
        skip: Joi.number().min(0).required(),
        sort: Joi.string().valid(...sort).required(),
        classification: Joi.object({
            category: Joi.string().hex().length(24).required(),
            branch: Joi.string().hex().length(24).allow(null),
        }).optional()
    }).validate(data);
};
//# sourceMappingURL=search.validate.js.map