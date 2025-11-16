import Joi, {} from "joi";
export const createCategory = (data) => {
    return Joi.object({
        name: Joi.string().min(2).max(20).required(),
        icon: Joi.string().hex().length(24).required(),
    }).validate(data);
};
export const createBranch = (data) => {
    return Joi.object({
        categoryId: Joi.string().hex().length(24),
        name: Joi.string().min(2).max(20),
        icon: Joi.string(),
    }).validate(data);
};
export const removeCategory = (data) => {
    return Joi.object({
        categoryId: Joi.string().hex().length(24)
    }).validate(data);
};
export const removeBranch = (data) => {
    return Joi.object({
        branchId: Joi.string().hex().length(24)
    }).validate(data);
};
export const updateCategory = (data) => {
    return Joi.object({
        name: Joi.string().min(2).max(20),
        icon: Joi.string(),
        categoryId: Joi.string().hex().length(24)
    }).validate(data);
};
export const updateBranch = (data) => {
    return Joi.object({
        name: Joi.string().min(2).max(20),
        icon: Joi.string(),
        branchId: Joi.string().hex().length(24)
    }).validate(data);
};
export const getCategory = (data) => {
    return Joi.object({
        categoryId: Joi.string().hex().length(24)
    }).validate(data);
};
export const getBranch = (data) => {
    return Joi.object({
        branchId: Joi.string().hex().length(24)
    }).validate(data);
};
//# sourceMappingURL=category.validate.js.map