import { type ValidationResult } from "joi";
export declare const create: (data: unknown) => ValidationResult<Product.Request.Create>;
export declare const update: (data: unknown) => ValidationResult<Product.Request.Update>;
export declare const buy: (data: unknown) => ValidationResult<Product.Request.Buy>;
export declare const productId: (data: unknown) => ValidationResult<{
    productId: string;
}>;
//# sourceMappingURL=product.validate.d.ts.map