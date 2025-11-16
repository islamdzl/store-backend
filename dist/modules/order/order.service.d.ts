import type { ClientSession } from 'mongoose';
export declare const getStore: (skip: number, limit: number) => Promise<Order[]>;
export declare const getUser: (userId: ID) => Promise<Order[]>;
export declare const create: (order: Order.Create, session?: ClientSession) => Promise<void>;
export declare const remove: (userId: ID, orderId: ID, force?: boolean, session?: ClientSession) => Promise<void>;
export declare const acceptMany: (updates: Order.AcceptMany[]) => Promise<{
    count: number;
    url: string;
}>;
export declare const rejectMany: (orderIds: ID[], message?: string) => Promise<number>;
export declare const setDoneMany: (userId: ID, orderIds: ID[]) => Promise<void>;
//# sourceMappingURL=order.service.d.ts.map