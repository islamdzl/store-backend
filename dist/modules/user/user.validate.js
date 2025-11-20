import Joi, {} from "joi";
export const buyingDetailsValidationObject = Joi.object({
    city: Joi.string().min(3).max(25).trim(),
    deliveryToHome: Joi.boolean(),
    fullName: Joi.string().min(1).max(25).trim(),
    note: Joi.string().min(0).max(300),
    phone1: Joi.string().min(9).max(11).trim(),
    phone2: Joi.string().min(9).max(11).trim().allow(''),
    postalCode: Joi.string().min(5).max(15).trim().optional(),
    state: Joi.number().min(1).max(58)
});
export const register = (data) => {
    return Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(5).max(30).required(),
        password: Joi.string().min(8).max(30).required()
    }).validate(data);
};
export const login = (data) => {
    return Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(30).required()
    }).validate(data);
};
export const update = (data) => {
    return Joi.object({
        buyingDetails: buyingDetailsValidationObject
    }).validate(data);
};
//# sourceMappingURL=user.validate.js.map