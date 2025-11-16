import Joi, {} from "joi";
import { buyingDetailsValidationObject } from '../user/user.validate.js';
export const create = (data) => {
    return Joi.object({
        name: Joi.string().min(3).max(25).required(),
        price: Joi.number().min(0).max(999999999).required(),
        description: Joi.string().min(0).max(300).optional(),
        isActive: Joi.boolean().default(true),
        quantity: Joi.number().min(1).max(999999).allow(null),
        delivery: Joi.number().min(0).allow(null),
        classification: Joi.object({
            category: Joi.string().hex().length(24).required(),
            branch: Joi.string().hex().length(24).allow(null),
        }),
        images: Joi.array().min(1).max(50).required().has(Joi.string().hex().length(24)),
        keyVal: Joi.array().items(Joi.object({
            key: Joi.string().min(2).max(20).required(),
            val: Joi.string().min(1).max(70).required()
        }).optional()).min(0).default([]),
    }).validate(data);
};
export const update = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24).required(),
        name: Joi.string().min(3).max(25).required(),
        price: Joi.number().min(0).max(999999999).required(),
        description: Joi.string().max(300).min(0),
        promo: Joi.number().min(0).max(99999999).allow(null),
        isActive: Joi.boolean(),
        quantity: Joi.number().min(1).max(999999).allow(null),
        delivery: Joi.number().min(0).allow(null),
        images: Joi.array().items(Joi.object({
            _id: Joi.string().hex().length(24).optional(),
            type: Joi.string().valid('old', 'new').required(),
            url: Joi.string().min(15).max(70).required()
        })).min(1),
        classification: Joi.object({
            category: Joi.string().hex().length(24).required(),
            branch: Joi.string().hex().length(24).required(),
        }).optional(),
        keyVal: Joi.array().items(Joi.object({
            key: Joi.string().min(2).max(20).required(),
            val: Joi.string().min(1).max(70).required()
        }).optional()).min(0).default([]),
    }).validate(data);
};
export const buy = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24),
        count: Joi.number().min(0).max(9999),
        buyingDetails: buyingDetailsValidationObject.optional(),
    }).validate(data);
};
export const productId = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24).required()
    }).validate(data);
};
//# sourceMappingURL=product.validate.js.map