import * as ProductService from './product.service.js'
import * as ProductValidate from './product.validate.js'
import * as Services from '../../shared/services.js'
import * as UserService from '../user/user.service.js'
import * as OrderService from '../order/order.service.js'
import * as CategoryService from '../category/category.service.js'
import * as CartService from '../cart/cart.service.js'
import * as LikeService from '../like/like.service.js'
import UploadService from '../upload/upload.service.js'
import AppResponse, { useAppResponse, catchAppError, ScreenMessageType } from '../../shared/app-response.js';
import type { HydratedDocument } from 'mongoose';


/**
 * - params [productId]
 * @param req 
 * @param res 
 */
export const get: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.params;
  const user = req.user;

  try {
    const { error, value } = ProductValidate.productId(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }
    const product = await ProductService.getProduct(value.productId, true);
    const responesProducts = await LikeService.ifLiked(await CartService.ifCartHas([product?.toJSON()!], user?._id), user?._id)
    useAppResponse(res, 
      new AppResponse(200)
      .setData(responesProducts[0])
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
  const data = req.params;
  const user = req.user!;

  try {
    const { error, value } = ProductValidate.productId(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }
    await ProductService.removeProduct(value.productId)
    useAppResponse(res,
      new AppResponse(200)
      .setData(true)
      .setScreenMessage('Deleted Successfully', ScreenMessageType.INFO)
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
      const classification = await CategoryService.createProductValidateCategoryAndBranch(value.classification.category, value.classification.branch)
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
        quantity: value.quantity,
        name: value.name,
        price: value.price,
        description: value.description,
        images: savedFilesPaths,
        delivery: value.delivery,
        classification,
        keyVal: value.keyVal,
      }
      const product = await ProductService.createProduct(newProduct, session)
      return product;
    })

    useAppResponse(res,
      new AppResponse(200)
      .setData(product.toJSON())
      .setScreenMessage('Created Successfully', ScreenMessageType.INFO)
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
    const { error, value } = ProductValidate.update(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }
    const product = await ProductService.getProduct(value.productId, true) as HydratedDocument<Product>
    
    const updatedProduct = await Services.withSession<HydratedDocument<Product>>( async(session)=> {
      const imagesToCreate = value.images.filter((i)=> i.type === 'new').map((i)=> i._id).reverse()
      const imagesToRemove = product.images.filter((u)=> ! value.images.filter((i)=> i.type === 'old').map((i)=> i.url).includes(u))
      const oldImages      = value.images.filter((i)=> i.type === 'old').map((i)=> i.url).reverse()

      const savedImagesPaths = await new UploadService()
      .destinationDirectory('products-images')
      .removeFilesPaths(imagesToRemove)
      .saveFilesIds(imagesToCreate)
      .force(imagesToCreate.length)
      .processType('PRODUCT_IMAGE')
      .session(session)
      .user(user._id)
      .Execute()
      .then((r)=> r.getSavedPaths())

      const productImages: string[] = value.images
      .reduce((images, { type }, index)=> {
        if (type === 'old') images.push(oldImages.pop()!)
        if (type === 'new') images.push(savedImagesPaths.pop()!)
        return images;
      }, [] as string[])
      
  
      const updates: Partial<Product> = {
        name: value.name,
        price: value.price,
        promo: value.promo,
        quantity: value.quantity,
        classification: value.classification,
        isActive: value.isActive,
        images: productImages,
        description: value.description,
        delivery: value.delivery,
        keyVal: value.keyVal
      }
      
      return await ProductService.updateProduct(value.productId, updates, session)
    })
    useAppResponse(res,
      new AppResponse(200)
      .setData(updatedProduct.toJSON())
      .setScreenMessage('Updated Successfully', ScreenMessageType.INFO)
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
        .runCommand('redirect', '/buying-details' + (user ? '' : `/${value.productId}`))
        .setScreenMessage('Buying details is required', ScreenMessageType.WARN)
      }
    }
    await Services.withSession( async(session)=> {
      if (! buyingDetails) {
        checkBuyingDetailes(user)
        const User = await UserService.getUser(user!._id, true)
        buyingDetails = User!.buyingDetails!
        checkBuyingDetailes(buyingDetails)
      }

      const product = await ProductService.getProduct(value.productId, true) as HydratedDocument<Product>;
      const newOrder: Order.Create = {
        count: value.count,
        status: 'PENDING' as Order.Status,
        product: product._id,
        totalPrice: (product.price * value.count) + Number(product.delivery) || 0 - product.promo || 0,
        userId: user?._id,
        buyingDetails: buyingDetails!,
      }
      await ProductService.handleBuying(product.toJSON(), value.count, session)
      await OrderService.create(newOrder, session)
    })
    useAppResponse(res,
      new AppResponse(200)
      .setData(true)
      .setScreenMessage('Bye Successfully', ScreenMessageType.INFO)
    )
  }catch(error) {
    catchAppError(error, res, 'Product Controller bye')
  }
}

