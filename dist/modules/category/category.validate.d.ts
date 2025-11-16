import { type ValidationResult } from "joi";
interface ICategoryId {
    categoryId: string;
}
interface IBranchId {
    branchId: string;
}
interface ICreateCategory extends Omit<Category.CreateCategory, 'branchs'> {
}
interface ICreateBranch extends Omit<Category.CreateBranch, 'posts'> {
    categoryId: string;
}
interface IUpdateCategory extends Category.UpdateCategory {
    categoryId: string;
}
interface IUpdateBranch extends Category.UpdateBranch {
    branchId: string;
}
interface IGetCategory {
    categoryId: string;
}
interface IGetBranch {
    branchId: string;
}
export declare const createCategory: (data: unknown) => ValidationResult<ICreateCategory>;
export declare const createBranch: (data: unknown) => ValidationResult<ICreateBranch>;
export declare const removeCategory: (data: unknown) => ValidationResult<ICategoryId>;
export declare const removeBranch: (data: unknown) => ValidationResult<IBranchId>;
export declare const updateCategory: (data: unknown) => ValidationResult<IUpdateCategory>;
export declare const updateBranch: (data: unknown) => ValidationResult<IUpdateBranch>;
export declare const getCategory: (data: unknown) => ValidationResult<IGetCategory>;
export declare const getBranch: (data: unknown) => ValidationResult<IGetBranch>;
export {};
//# sourceMappingURL=category.validate.d.ts.map