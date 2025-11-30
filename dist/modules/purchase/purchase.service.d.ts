import type { ClientSession } from 'mongoose';
export declare const createMany: (purchases: Purchase.Create[], session?: ClientSession) => Promise<void>;
export declare const getByDate: (start: Date, end: Date, productId?: ID) => Promise<Purchase[]>;
//# sourceMappingURL=purchase.service.d.ts.map