import { type ClientSession, type HydratedDocument } from "mongoose";
export declare const getProduct: (productId: ID, force?: boolean) => Promise<HydratedDocument<Product> | null>;
export declare const removeProduct: (productId: ID) => Promise<Product>;
export declare const createProduct: (productData: Partial<Product.Create>, session?: ClientSession) => Promise<HydratedDocument<Product>>;
export declare const updateProduct: (productId: ID, newProduct: Partial<Product>, session?: ClientSession) => Promise<HydratedDocument<Product>>;
export declare const changequantityAndReqursts: (productId: ID, quantity: number, requests: number, force?: boolean, session?: ClientSession) => Promise<void>;
export declare const setActivity: (productId: ID, activity: boolean, force?: boolean, session?: ClientSession) => Promise<void>;
interface IhandleBuyingUserData {
    count: number;
    color?: string;
    types: Product.Request.Buy.Type[];
}
export declare const handleBuying: (product: Product, data: IhandleBuyingUserData, session?: ClientSession) => Promise<void>;
export {};
//# sourceMappingURL=product.service.d.ts.map