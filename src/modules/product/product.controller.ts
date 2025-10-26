import * as ProductService from './product.service.js'
import * as ProductValidate from './product.validate.js'
import * as Services from '../../shared/services.js'
import * as UserService from '../user/user.service.js'
import * as OrderService from '../order/order.service.js'
import * as CategoryService from '../category/category.service.js'
import UploadService from '../upload/upload.service.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';
import type { HydratedDocument } from 'mongoose';


/**
 * - params [productId]
 * @param req 
 * @param res 
 */
export const get: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const productId = req.params['productId']!;

  try {
    const product = await ProductService.getProduct(productId, true);
    useAppResponse(res, 
      new AppResponse(200)
      .setData(product!.toJSON())
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller get')
  }
}

/**
 * - params [productId]
 * @param req 
 * @param res 
 */
export const remove: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const productId = req.params['productId']!;
  const user = req.user!;

  try {
    if (! Services.isAdmin(user.email)) {
      throw new AppResponse(409)
      .setScreenMessage('Forbidden Action', ScreenMessageType.ERROR)
    }
    await ProductService.removeProduct(productId)
    useAppResponse(res,
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller remove')
  }
}

/**
 * - Create new Product
 * @param req 
 * @param res 
 */
export const create: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    if (! Services.isAdmin(user.email)) {
      throw new AppResponse(409)
      .setScreenMessage('Forbidden Action', ScreenMessageType.ERROR)
    }

    const { error, value } = ProductValidate.create(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }


    const product = await Services.withSession<HydratedDocument<Product>>( async(session)=> {
      const classification = await CategoryService.createProductValidateCategoryAndBranch(value.branchId!)
      const savedFilesPaths = await new UploadService()
      .destinationDirectory('products-images')
      .saveFilesIds(value.images)
      .force(value.images.length)
      .processType('PRODUCT_IMAGE')
      .session(session)
      .user(user._id)
      .Execute()
      .then((r)=> r.getSavedPaths())

      const newProduct: Product.Create = {
        isActive: true,
        requests: 0,
        contity: value.contity,
        name: value.name,
        price: value.price,
        description: value.description,
        images: savedFilesPaths,
        classification
      }
      const product = await ProductService.createProduct(newProduct, session)
      return product;
    })

    useAppResponse(res,
      new AppResponse(200)
      .setData(product.toJSON())
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller create')
  }
}


/**
 * - Update Product
 * @param req 
 * @param res 
 */
export const update: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user!;

  try {
    if (! Services.isAdmin(user.email)) {
      throw new AppResponse(409)
      .setScreenMessage('Forbidden Action', ScreenMessageType.ERROR)
    }

    const { error, value } = ProductValidate.update(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }
    const product = await ProductService.getProduct(value.productId, true) as HydratedDocument<Product>
    
    const updatedProduct = await Services.withSession<HydratedDocument<Product>>( async(session)=> {
      const savedImagesPaths = await new UploadService()
      .destinationDirectory('products-images')
      .removeFilesPaths(value.RImages)
      .saveFilesIds(value.AImages)
      .force(value.AImages.length)
      .processType('PRODUCT_IMAGE')
      .session(session)
      .user(user._id)
      .Execute()
      .then((r)=> r.getSavedPaths())
  
      const productImages = product.images.filter((p)=> ! value.RImages.includes(p))
      .concat(savedImagesPaths)
  
      const updates: Partial<Product> = {
        name: value.name,
        price: value.price,
        images: productImages,
        description: value.description,
      }
      
      return await ProductService.updateProduct(value.productId, updates, session)
    })
    useAppResponse(res,
      new AppResponse(200)
      .setData(updatedProduct.toJSON())
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller update')
  }
}


export const bye: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body!;
  const user = req.user;

  try {
    const { error, value } = ProductValidate.buy(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    let buyingDetails = value.buyingDetails;
    
    const checkBuyingDetailes = (ob: any)=> {
      if (! ob) {
        throw new AppResponse(400)
        .runCommand('redirect', '/settings?section=buying-details')
        .setScreenMessage('Buying details is required', ScreenMessageType.WARN)
      }
    }
    await Services.withSession( async(session)=> {
      if (! buyingDetails) {
        checkBuyingDetailes(user)
        const User = await UserService.getUser(user!._id, true)
        checkBuyingDetailes(User!.buyingDetails)
      }

      const product = await ProductService.getProduct(value.productId, true) as HydratedDocument<Product>;
      const newOrder: Order.Create = {
        count: value.count,
        status: Order.Status.PENDING,
        product: product._id,
        totalPrice: product.price * value.count,
        userId: user?._id
      }
      await ProductService.handleBuying(product.toJSON(), value.count, session)
      await OrderService.create(newOrder, session)
    })
    useAppResponse(res,
      new AppResponse(200)
      .setData(true)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller bye')
  }
}

