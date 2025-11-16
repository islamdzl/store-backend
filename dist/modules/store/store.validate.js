import Joi from "joi";
export const get = (data) => {
    return Joi.object({}).validate(data);
};
export const update = (data) => {
    return Joi.object({
        name: Joi.string().trim().min(3).max(20),
        description: Joi.string().max(300),
        logo: Joi.string().hex().length(24),
        banner: Joi.string().hex().length(24),
        contact: Joi.object({
            email: Joi.string().email(),
            location: Joi.string().min(10).max(50),
            phone1: Joi.string().min(9).max(11),
            phone2: Joi.string().min(9).max(11),
        }),
        media: Joi.object({
            facebook: Joi.string().min(10).max(100),
            instagram: Joi.string().min(10).max(100),
            tiktok: Joi.string().min(10).max(100),
        })
    }).validate(data);
};
//# sourceMappingURL=store.validate.js.map