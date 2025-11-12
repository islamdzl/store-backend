import * as SearchValidate from './search.validate.js'
import * as SearchService from './search.service.js'
import * as CartService from '../cart/cart.service.js'
import * as LikesService from '../like/like.service.js'
import AppResponse, { catchAppError, ScreenMessageType } from "../../shared/app-response.js"

export const explore: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body;
  const user = req.user;

  try {
    const { error, value } = SearchValidate.explore(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const filter: Search.FindProductsFilter = {
      classification: value.classification,
      limit: value.limit,
      skip: value.skip,
      sort: value.sort
    }

    const products = await SearchService.findProducts(value.keyWord, filter)
    const productsResult = await LikesService.ifLiked(await CartService.ifCartHas(products, user?._id), user?._id)

    const response = {
      products: productsResult,
      moreRuselts: (products.length === value.limit)
    }
    
    const appResponse = new AppResponse(200)
    appResponse.setData(response)
    if (products.length < value.limit) {
      appResponse.setScreenMessage('Invalid more Products', ScreenMessageType.WARN)
    }
    throw appResponse;
  }catch(error) {
    catchAppError(error, res, 'Search Controller explore')
  }
}