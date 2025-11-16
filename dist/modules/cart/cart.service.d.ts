import type { ClientSession } from 'mongoose';
export declare const addProduct: (userId: ID, cartItem: Cart.AddItem, session?: ClientSession) => Promise<Cart[]>;
export declare const removeProduct: (userId: ID, productId: ID, cartItemId: ID, session?: ClientSession) => Promise<Cart[]>;
export declare const getCart: (userId: ID) => Promise<Cart[]>;
export declare const ifCartHas: (product: Product[] | Search.ProductResponse[], userId?: ID) => Promise<Search.ProductResponse[]>;
export declare const encrement: (userId: ID, cartItemId: ID, session?: ClientSession) => Promise<Cart>;
export declare const decrement: (userId: ID, cartItemId: ID, session?: ClientSession) => Promise<Cart>;
//# sourceMappingURL=cart.service.d.ts.map