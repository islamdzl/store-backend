import type { ClientSession, HydratedDocument } from 'mongoose';
export declare const create: (info: Partial<User>, session?: ClientSession) => Promise<HydratedDocument<User>>;
export declare const ifExist: (condition: Partial<User>) => Promise<boolean>;
export declare const loginResponse: (user: User) => User.LoginResponse;
export declare const getUserByEmail: (email: string, force?: boolean) => Promise<HydratedDocument<User> | null>;
export declare const deleteAccount: (userId: ID) => Promise<void>;
export declare const getUser: (userId: ID, force?: boolean) => Promise<HydratedDocument<User> | null>;
export declare const update: (userId: ID, newUser: Partial<User.Update>) => Promise<User>;
//# sourceMappingURL=user.service.d.ts.map