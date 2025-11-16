import type { Types } from 'mongoose';
declare global {
    interface IJWTPayload {
        _id: string | Types.ObjectId;
    }
}
export declare const YMD: (before?: string, after?: string) => string;
export declare const hashPassword: (rowPassword: string) => Promise<string>;
export declare const verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const jwtSign: (payload: IJWTPayload) => string;
export declare const jwtVerify: (token: string) => Promise<IJWTPayload>;
//# sourceMappingURL=utils.d.ts.map