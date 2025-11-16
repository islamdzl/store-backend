import type { ClientSession } from "mongoose";
export declare const isAdmin: (email: string) => boolean;
export declare const withSession: <T>(callBack: ((session: ClientSession) => Promise<T>)) => Promise<T>;
//# sourceMappingURL=services.d.ts.map