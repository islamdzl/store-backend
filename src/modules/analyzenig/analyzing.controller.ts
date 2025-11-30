import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from "../../shared/app-response.js";
import * as PurchaseValidate from './analyzing.validate.js'
import * as AnalyzingService from './analyzing.service.js'

export const getSell: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body;
  const user = req.user;

  try {
    const { error, value } = PurchaseValidate.sellData(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const response = await AnalyzingService.getSellData(value)

    useAppResponse(res,
      new AppResponse(200)
      .setData(response)
    )
  }catch(error) {
    catchAppError(error, res, 'Purchase Controller getSell')
  }
}


export const getProfitData: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body;
  const user = req.user;

  try {
    const { error, value } = PurchaseValidate.profitData(data);
    if (error) {
      throw new AppResponse(400)
      .setScreenMessage(error.message, ScreenMessageType.ERROR)
    }

    const response = await AnalyzingService.getProfitData(value)

    useAppResponse(res,
      new AppResponse(200)
      .setData(response)
    )
  }catch(error) {
    catchAppError(error, res, 'Purchase Controller getProfitData')
  }
}

export const genral: (req: Req, res: Res)=> Promise<unknown> = async(req, res)=> {
  const data = req.body;
  const user = req.user;

  try {
    const response = await AnalyzingService.genral()

    useAppResponse(res,
      new AppResponse(200)
      .setData(response)
    )
  }catch(error) {
    catchAppError(error, res, 'Purchase Controller getProfitData')
  }
}