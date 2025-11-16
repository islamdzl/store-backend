import Joi, {} from "joi";
const processtype = [
    'ICON', 'PRODUCT_IMAGE', 'LOGO', 'BANNER'
];
export default (data) => {
    return Joi.object({
        process: Joi.string().allow(...processtype).required()
    }).validate(data);
};
//# sourceMappingURL=upload.validate.js.map