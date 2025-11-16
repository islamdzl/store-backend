import { type ClientSession, type HydratedDocument } from 'mongoose';
export declare const createCategory: (category: Category.CreateCategory, session?: ClientSession) => Promise<Category>;
export declare const createBranch: (categoryId: ID, branch: Category.CreateBranch, session?: ClientSession) => Promise<Category.Branch>;
export declare const removeCategorjy: (categoryId: ID) => Promise<void>;
export declare const removeBranch: (branchId: ID) => Promise<void>;
export declare const updateCategory: (categoryId: ID, updates: Category.UpdateCategory) => Promise<Category>;
export declare const updateBranch: (branchId: ID, updates: Category.UpdateBranch) => Promise<Category.Branch>;
export declare const getAll: () => Promise<Category[]>;
export declare const getCategory: (categoryId: ID, force?: boolean) => Promise<HydratedDocument<Category> | null>;
export declare const getBranch: (branchId: ID, force?: boolean) => Promise<Category.Branch | null>;
export declare const createProductValidateCategoryAndBranch: (categoryId: ID, branchId: ID | null) => Promise<Product.Classification>;
//# sourceMappingURL=category.service.d.ts.map