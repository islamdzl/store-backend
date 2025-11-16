import mongoose, { Types } from 'mongoose';
import CategoryModel from './category.model.js';
import UploadService from '../upload/upload.service.js';
import AppResponse, { ScreenMessageType } from '../../shared/app-response.js';
export const createCategory = async (category, session) => {
    const newCategory = new CategoryModel(category);
    await newCategory.save({ session });
    return newCategory.toJSON();
};
export const createBranch = async (categoryId, branch, session) => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
        throw new AppResponse(404).setScreenMessage('Category not found', ScreenMessageType.ERROR);
    }
    const newBranch = {
        _id: new Types.ObjectId(),
        name: branch.name,
        icon: branch.icon,
        posts: 0,
        __v: 0
    };
    category.branchs.push(newBranch);
    await category.save({ session });
    return newBranch;
};
export const removeCategorjy = async (categoryId) => {
    const category = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) {
        throw new AppResponse(404)
            .setScreenMessage('Category not found', ScreenMessageType.ERROR);
    }
    const filesPathsToDelete = category.toJSON().branchs.map((b) => b.icon).filter((p) => typeof p === 'string');
    if (category.icon)
        filesPathsToDelete.push(category.icon);
    await new UploadService()
        .removeFilesPaths(filesPathsToDelete)
        .Execute();
};
export const removeBranch = async (branchId) => {
    const category = await CategoryModel.findOneAndUpdate({ 'branchs._id': new Types.ObjectId(branchId) }, { $pull: { branchs: { _id: branchId } } });
    if (!category) {
        throw new AppResponse(404)
            .setScreenMessage('Branch not found', ScreenMessageType.ERROR);
    }
    const targetBranch = category.branchs.find((b) => b._id.toString() === branchId);
    await new UploadService()
        .removeFilesPaths([targetBranch.icon])
        .Execute();
};
export const updateCategory = async (categoryId, updates) => {
    const category = await CategoryModel.findByIdAndUpdate(categoryId, { $set: updates }, { new: false });
    if (!category) {
        throw new AppResponse(404)
            .setScreenMessage('Category not found', ScreenMessageType.ERROR);
    }
    await new UploadService()
        .removeFilesPaths([category.icon])
        .Execute();
    const updatedCategory = await getCategory(categoryId, true);
    return updatedCategory;
};
export const updateBranch = async (branchId, updates) => {
    const setObj = Object.fromEntries(Object.entries(updates)
        .filter(([_, v]) => v !== undefined)
        .map(([key, value]) => [`branchs.$.${key}`, value]));
    const category = await CategoryModel.findOneAndUpdate({ 'branchs._id': new Types.ObjectId(branchId) }, {
        $set: setObj
    }, { new: false });
    if (!category) {
        throw new AppResponse(404)
            .setScreenMessage('Branch not found', ScreenMessageType.ERROR);
    }
    const targetBranch = category.branchs.find((b) => b._id.toString() === branchId);
    await new UploadService()
        .removeFilesPaths([targetBranch.icon])
        .Execute();
    const branch = await getBranch(branchId, true);
    return branch;
};
export const getAll = async () => {
    const categorys = await CategoryModel.find()
        .lean()
        .exec();
    return categorys;
};
export const getCategory = async (categoryId, force) => {
    const category = await CategoryModel.findById(categoryId);
    if (!category && force) {
        throw new AppResponse(404)
            .setScreenMessage('Category not found', ScreenMessageType.ERROR);
    }
    return category;
};
export const getBranch = async (branchId, force) => {
    const branchIdObject = new mongoose.Types.ObjectId(branchId);
    const category = await CategoryModel.findOne({
        'branchs._id': branchIdObject
    })
        .lean();
    if (!category) {
        if (force) {
            throw new AppResponse(404)
                .setScreenMessage('Branch not found', ScreenMessageType.ERROR);
        }
        return null;
    }
    return category.branchs.find((b) => b._id.toString() === branchId); // branchId = string
};
export const createProductValidateCategoryAndBranch = async (categoryId, branchId) => {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
        throw new AppResponse(404)
            .setScreenMessage('Category not found', ScreenMessageType.ERROR);
    }
    const branch = category.branchs.find((b) => b._id.toString() === branchId);
    if (branchId) {
        if (!branch) {
            throw new AppResponse(404)
                .setScreenMessage('Branch not found', ScreenMessageType.ERROR);
        }
    }
    return {
        category: category._id,
        branch: branch?._id.toString() || null
    };
};
//# sourceMappingURL=category.service.js.map