import { type ValidationResult } from "joi";
export declare const addProduct: (data: unknown) => ValidationResult<Cart.AddItem>;
export declare const removeProduct: (data: unknown) => ValidationResult<Cart.RemoveItem>;
export declare const encrement: (data: unknown) => ValidationResult<Cart.Encrement>;
export declare const decrement: (data: unknown) => ValidationResult<Cart.Decrement>;
//# sourceMappingURL=cart.validate.d.ts.map