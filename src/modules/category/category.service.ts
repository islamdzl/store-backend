import mongoose, { Types, type ClientSession, type HydratedDocument } from 'mongoose';
import CategoryModel from './category.model.js';
import UploadService from '../upload/upload.service.js'
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';


export const createCategory: (category: Category.CreateCategory, session?: ClientSession)=> Promise<void> = async(category, session)=> {
  const newCategory = new CategoryModel(category)
  await newCategory.save({session})
}

export const createBranch: (categoryId: ID, branch: Category.CreateBranch, session?: ClientSession)=> Promise<void> = async(categoryId, branch, session)=> {
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new AppResponse(404).setScreenMessage('Category not found', ScreenMessageType.ERROR);
  }

  const newBranch: Category.Branch = {
    _id: new Types.ObjectId(),
    name: branch.name,
    icon: branch.icon,
    posts: 0,
    __v: 0
  }
  category.branchs.push(newBranch);
  await category.save({ session });
}

export const removeCategorjy: (categoryId: ID)=> Promise<void> = async(categoryId)=> {
  const category = await CategoryModel.findByIdAndDelete(categoryId);
  if (! category) {
    throw new AppResponse(404)
    .setScreenMessage('Category not found', ScreenMessageType.ERROR)
  }

  const filesPathsToDelete: string[] = 
    category.toJSON().branchs.map((b)=> b.icon).filter((p)=> typeof p === 'string')
    if (category.icon) filesPathsToDelete.push(category.icon);

    await new UploadService()
    .removeFilesPaths(filesPathsToDelete)
    .Execute()
}

export const removeBranch: (branchId: ID)=> Promise<void> = async(branchId)=> {
  const category = await CategoryModel.findOneAndUpdate(
    { 'branchs._id': branchId },
    { $pull: { branchs: { _id: branchId } }}
  )

  if (! category) {
    throw new AppResponse(404)
    .setScreenMessage('Branch not found', ScreenMessageType.ERROR)
  }

  const targetBranch = category.branchs.find((b)=> b._id.toString() === branchId)!
  await new UploadService()
  .removeFilesPaths([targetBranch.icon])
  .Execute()
}

export const updateCategory: (categoryId: ID, updates: Category.UpdateCategory)=> Promise<void> = async(categoryId, updates)=> {
  const category = await CategoryModel.findByIdAndUpdate(categoryId,
    { $set: updates},
    { new: false }
  )

  if (! category) {
    throw new AppResponse(404)
    .setScreenMessage('Category not found', ScreenMessageType.ERROR)
  }

  await new UploadService()
  .removeFilesPaths([category.icon])
  .Execute()
}

export const updateBranch: (branchId: ID, updates: Category.UpdateBranch)=> Promise<void> = async(branchId, updates)=> {

  const setObj = Object.fromEntries(
    Object.entries(updates)
    .filter(([_, v])=> v !== undefined)
    .map(([key, value])=> [`branch.$.${key}`, value])
  )

  const category = await CategoryModel.findOneAndUpdate(
    { 'branchs._id': branchId },
    { 
      $set: setObj
    },
    { new: false }
  )

  if (! category) {
    throw new AppResponse(404)
    .setScreenMessage('Branch not found', ScreenMessageType.ERROR)
  }

  const targetBranch = category.branchs.find((b)=> b._id.toString() === branchId)!
  await new UploadService()
  .removeFilesPaths([targetBranch.icon])
  .Execute()
}

export const getAll: ()=> Promise<Category[]> = async()=> {
  const categorys = await CategoryModel.find()
  .lean()
  .exec()
  return categorys;
}

export const getCategory: (categoryId: ID, force?: boolean)=> Promise<HydratedDocument<Category> | null> = async(categoryId, force)=> {
  const category = await CategoryModel.findById(categoryId);
  if (! category && force) {
    throw new AppResponse(404)
    .setScreenMessage('Category not found', ScreenMessageType.ERROR)
  }
  return category;
}

export const getBranch: (branchId: ID, force?: boolean)=> Promise<Category.Branch | null> = async(branchId, force)=> {
  const branchIdObject = new mongoose.Types.ObjectId(branchId);
  const category = await CategoryModel.findOne({
    'branchs._id': branchIdObject
  })
  .lean();

  if (! category) {
    if (force) {
      throw new AppResponse(404)
      .setScreenMessage('Branch not found', ScreenMessageType.ERROR)
    }
    return null;
  }

  return category.branchs.find((b)=> b._id.toString() === branchId)!; // branchId = string
}

export const createProductValidateCategoryAndBranch: (branchId: ID)=> Promise<Product.Classification> = async(branchId)=> {
  const branchIdObject = new mongoose.Types.ObjectId(branchId);

  const category = await CategoryModel.findOne({
    'branchs._id': branchIdObject
  })
  .lean();
  if (! category) {
    throw new AppResponse(404)
    .setScreenMessage('Branch not found', ScreenMessageType.ERROR)
  }
  
  return {
    category: category._id,
    branch: branchId
  }
}
