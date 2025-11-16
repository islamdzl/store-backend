import { type ValidationResult } from "joi";
interface IGetStore {
    skip: number;
    limit: number;
}
interface IOrderId {
    orderId: ID;
}
export declare const orderId: (data: unknown) => ValidationResult<IOrderId>;
export declare const getStore: (data: unknown) => ValidationResult<IGetStore>;
export declare const acceptMany: (data: unknown) => ValidationResult<Order.AcceptMany[]>;
export declare const rejectMany: (data: unknown) => ValidationResult<Order.RejectMany>;
export declare const setDoneMany: (data: unknown) => ValidationResult<ID[]>;
export {};
//# sourceMappingURL=order.validate.d.ts.map