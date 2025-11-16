import Joi, { type ValidationResult } from "joi";
export declare const buyingDetailsValidationObject: Joi.ObjectSchema<User.BuyingDetails>;
export declare const register: (data: unknown) => ValidationResult<User.Register>;
export declare const login: (data: unknown) => ValidationResult<User.Login>;
export declare const update: (data: unknown) => ValidationResult<Partial<User.Update>>;
//# sourceMappingURL=user.validate.d.ts.map