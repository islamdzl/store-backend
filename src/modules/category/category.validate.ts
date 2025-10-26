import Joi, { type ValidationResult } from "joi"

interface ICategoryId {
  categoryId: string
}
interface IBranchId {
  branchId: string
}

interface ICreateCategory extends Omit<Category.CreateCategory, 'branchs'> {}
interface ICreateBranch   extends Omit<Category.CreateBranch,   'posts'>   {
  categoryId: string
}

interface IUpdateCategory   extends Category.UpdateCategory {
  categoryId: string
}
interface IUpdateBranch   extends Category.UpdateBranch {
  branchId: string
}

interface IGetCategory {
  categoryId: string;
}
interface IGetBranch {
  branchId: string;
}

export const createCategory = (data: unknown)=> {
  return Joi.object<ICreateCategory>({
    name: Joi.string().min(2).max(20).required(),
    icon: Joi.string().hex().length(24).required(),
  }).validate(data) as ValidationResult<ICreateCategory>
}

export const createBranch = (data: unknown)=> {
  return Joi.object<ICreateBranch>({
    name: Joi.string().min(2).max(20),
    icon: Joi.string(),
  }).validate(data) as ValidationResult<ICreateBranch>
}

export const removeCategory = (data: unknown)=> {
  return Joi.object<ICategoryId>({
    categoryId: Joi.string().hex().length(24)
  }).validate(data) as ValidationResult<ICategoryId>
}

export const removeBranch = (data: unknown)=> {
  return Joi.object<IBranchId>({
    branchId: Joi.string().hex().length(24)
  }).validate(data) as ValidationResult<IBranchId>
}

export const updateCategory = (data: unknown)=> {
  return Joi.object<IUpdateCategory>({
    name: Joi.string().min(2).max(20),
    icon: Joi.string(),
    categoryId: Joi.string().hex().length(24)
  }).validate(data) as ValidationResult<IUpdateCategory>
}

export const updateBranch = (data: unknown)=> {
  return Joi.object<IUpdateBranch>({
    name: Joi.string().min(2).max(20),
    icon: Joi.string(),
    branchId: Joi.string().hex().length(24)
  }).validate(data) as ValidationResult<IUpdateBranch>
}

export const getCategory = (data: unknown)=> {
  return Joi.object<IGetCategory>({
    categoryId: Joi.string().hex().length(24)
  }).validate(data) as ValidationResult<IGetCategory>
}

export const getBranch = (data: unknown)=> {
  return Joi.object<IGetBranch>({
    branchId: Joi.string().hex().length(24)
  }).validate(data) as ValidationResult<IGetBranch>
}