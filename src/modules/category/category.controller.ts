import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from "../../shared/app-response.js";
import * as CategoryValidate from './category.validate.js'
import * as CategoryService from './category.service.js'
import UploadService from '../upload/upload.service.js'
import { withSession } from "../../shared/services.js";


export const getAll: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try{
    const categorys = await CategoryService.getAll()
    useAppResponse(res, 
      new AppResponse(200)
      .setData(categorys)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller getAll')
  }
}

export const getCategory: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.params!;

  try{
    const { error, value } = CategoryValidate.getCategory(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const category = await CategoryService.getCategory(value.categoryId, true)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(category)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller getCategory')
  }
}

export const getBranch: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.params!;

  try{
    const { error, value } = CategoryValidate.getBranch(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const branch = await CategoryService.getBranch(value.branchId, true)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(branch)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller getBranch')
  }
}

export const removeCategory: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try{
    const { error, value } = CategoryValidate.removeCategory(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    await CategoryService.removeCategorjy(value.categoryId)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller removeCategory')
  }
}

export const removeBranch: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try{
    const { error, value } = CategoryValidate.removeBranch(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    await CategoryService.removeBranch(value.branchId)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller removeBranch')
  }
}

export const createCategory: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try{
    const { error, value } = CategoryValidate.createCategory(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const newCategory = await withSession<Category>(async(session)=> {
      const payloads = await new UploadService()
      .destinationDirectory('/categorys')
      .saveFilesIds([value.icon])
      .processType('ICON')
      .session(session)
      .user(user._id)
      .force(1)
      .Execute()
      .then((r)=> r.getSavedPaths())
      const newCategory: Category.CreateCategory = {
        icon: payloads[0]!,
        name: value.name,
        branchs: [],
      }
      return await CategoryService.createCategory(newCategory, session)
    })
    useAppResponse(res, 
      new AppResponse(200)
      .setData(newCategory)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller createCategory')
  }
}


export const createBranch: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try{
    const { error, value } = CategoryValidate.createBranch(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const branch = await withSession(async(session)=> {

      const payloads= await new UploadService()
      .destinationDirectory('/categorys-branchs')
      .saveFilesIds([value.icon])
      .processType('ICON')
      .session(session)
      .user(user._id)
      .force(1)
      .Execute()
      .then((r)=> r.getSavedPaths())

      const newBranch: Category.CreateBranch = {
        posts: 0,
        name: value.name,
        icon: payloads[0]!
      }

      return await CategoryService.createBranch(value.categoryId, newBranch, session)
    })

    const categorys = await CategoryService.getAll()
    useAppResponse(res, 
      new AppResponse(200)
      .setData(branch)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller createBranch')
  }
}

export const updateCategory: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try{
    const { error, value } = CategoryValidate.updateCategory(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const updatedCategory = await withSession(async(session)=> {

      if (value.icon) {
        const oldCategory = await CategoryService.getCategory(value.categoryId, true)
        const payloads = await new UploadService()
        .destinationDirectory('/categorys')
        .saveFilesIds([value.icon])
        .processType('ICON')
        .session(session)
        .user(user._id)
        .force(1)
        .Execute()
        .then((r)=> r.getSavedPaths())
        value.icon = payloads[0]!;
      }

      const updatedCategory: Category.UpdateCategory = {
        name: value.name,
        icon: value.icon,
      }
      return await CategoryService.updateCategory(value.categoryId, updatedCategory)
    })

    useAppResponse(res, 
      new AppResponse(200)
      .setData(updatedCategory)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller updateCategory')
  }
}


export const updateBranch: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const user = req.user!;
  const data = req.body!;

  try{
    const { error, value } = CategoryValidate.updateBranch(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const updatedBranch = await withSession(async(session)=> {

      if (value.icon) {
        const oldBanch = await CategoryService.getBranch(value.branchId, true)
        const payloads = await new UploadService()
        .destinationDirectory('/categorys-branchs')
        .saveFilesIds([value.icon])
        .removeFilesPaths([oldBanch!.icon])
        .processType('ICON')
        .session(session)
        .user(user._id)
        .force(1)
        .Execute()
        .then((r)=> r.getSavedPaths())
        value.icon = payloads[0]!;
      }

      const updatedBranch: Category.UpdateBranch = {
        name: value.name,
        icon: value.icon,
      }
      return await CategoryService.updateBranch(value.branchId, updatedBranch)
    })

    useAppResponse(res, 
      new AppResponse(200)
      .setData(updatedBranch)
    )
  }catch(error) {
    catchAppError(error, res, 'Category Controller updateBranch')
  }
}

