import { type ClientSession, type HydratedDocument } from "mongoose";
export declare const getProduct: (productId: ID, force?: boolean) => Promise<HydratedDocument<Product> | null>;
export declare const removeProduct: (productId: ID) => Promise<Product>;
export declare const createProduct: (productData: Product.Create, session?: ClientSession) => Promise<HydratedDocument<Product>>;
export declare const updateProduct: (productId: ID, newProduct: Partial<Product>, session?: ClientSession) => Promise<HydratedDocument<Product>>;
export declare const changequantityAndReqursts: (productId: ID, quantity: number, requests: number, force?: boolean, session?: ClientSession) => Promise<void>;
export declare const setActivity: (productId: ID, activity: boolean, force?: boolean, session?: ClientSession) => Promise<void>;
export declare const handleBuying: (product: Product, userCount: number, session?: ClientSession) => Promise<void>;
//# sourceMappingURL=product.service.d.ts.map