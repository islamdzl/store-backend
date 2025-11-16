import type { ClientSession } from 'mongoose';
export declare const getUser: (userId: ID) => Promise<Like[]>;
export declare const create: (userId: ID, productId: ID, session?: ClientSession) => Promise<void>;
export declare const remove: (userId: ID, productId: ID, likeItemId: ID, session?: ClientSession) => Promise<void>;
export declare const ifLiked: (product: Product[] | Search.ProductResponse[], userId?: ID) => Promise<Search.ProductResponse[]>;
//# sourceMappingURL=like.service.d.ts.map