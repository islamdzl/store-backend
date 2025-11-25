import Joi, {} from "joi";
import { buyingDetailsValidationObject } from '../user/user.validate.js';
export const create = (data) => {
    return Joi.object({
        name: Joi.string().trim().min(3).max(25).required(),
        price: Joi.number().min(0).max(999999999).required(),
        description: Joi.string().min(0).max(300).optional().allow(null),
        isActive: Joi.boolean().default(true),
        quantity: Joi.number().min(1).max(999999).optional().allow(null),
        delivery: Joi.number().min(0).allow(null),
        classification: Joi.object({
            category: Joi.string().hex().length(24).required(),
            branch: Joi.string().hex().length(24).allow(null),
        }),
        images: Joi.array().min(1).max(50).required().has(Joi.string().hex().length(24)),
        colors: Joi.array().items(Joi.string()).max(50).optional().allow(null),
        types: Joi.array().items(Joi.object({
            typeName: Joi.string().max(30),
            values: Joi.array().items(Joi.string())
        })).optional().allow(null),
        keyVal: Joi.array().items(Joi.object({
            key: Joi.string().min(2).max(20).required(),
            val: Joi.string().min(1).max(70).required()
        }).optional()).min(0).default([]),
    })
        .strict()
        .validate(data);
};
export const update = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24).required(),
        name: Joi.string().trim().min(3).max(25).optional(),
        price: Joi.number().min(0).max(999999999).optional(),
        description: Joi.string().max(300).min(0).optional(),
        promo: Joi.number().min(0).max(99999999).optional().allow(null),
        isActive: Joi.boolean().optional(),
        quantity: Joi.number().min(1).max(999999).optional().allow(null),
        delivery: Joi.number().min(0).optional().allow(null),
        images: Joi.array().items(Joi.object({
            _id: Joi.string().hex().length(24).optional(),
            type: Joi.string().valid('old', 'new').required(),
            url: Joi.string().min(15).max(70).required()
        })).min(1).max(70).optional(),
        classification: Joi.object({
            category: Joi.string().hex().length(24).required(),
            branch: Joi.string().hex().length(24).optional().allow(null)
        }).optional().allow(null),
        colors: Joi.array().items(Joi.string()).max(50).optional().allow(null),
        types: Joi.array().items(Joi.object({
            typeName: Joi.string().max(30),
            values: Joi.array().items(Joi.string())
        })).optional().allow(null),
        keyVal: Joi.array().items(Joi.object({
            key: Joi.string().min(2).max(20).required(),
            val: Joi.string().min(1).max(70).required()
        }).optional()).min(0).optional(),
    })
        .strict()
        .validate(data);
};
export const buy = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24),
        count: Joi.number().min(0).max(9999),
        buyingDetails: buyingDetailsValidationObject.optional(),
        color: Joi.string().optional().allow(null),
        types: Joi.array().items(Joi.object({
            typeName: Joi.string().max(30),
            selectedIndex: Joi.number().min(0),
        }))
    }).validate(data);
};
export const productId = (data) => {
    return Joi.object({
        productId: Joi.string().hex().length(24).required()
    }).validate(data);
};
//# sourceMappingURL=product.validate.js.map