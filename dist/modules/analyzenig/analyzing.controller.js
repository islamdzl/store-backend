import AppResponse, { catchAppError, ScreenMessageType, useAppResponse } from "../../shared/app-response.js";
import * as PurchaseValidate from './analyzing.validate.js';
import * as AnalyzingService from './analyzing.service.js';
export const getSell = async (req, res) => {
    const data = req.params;
    const user = req.user;
    try {
        const { error, value } = PurchaseValidate.sellData(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.ERROR);
        }
        const response = await AnalyzingService.getSellData(value);
        useAppResponse(res, new AppResponse(200)
            .setData(response));
    }
    catch (error) {
        catchAppError(error, res, 'Purchase Controller getSell');
    }
};
export const getProfitData = async (req, res) => {
    const data = req.params;
    const user = req.user;
    try {
        const { error, value } = PurchaseValidate.sellData(data);
        if (error) {
            throw new AppResponse(400)
                .setScreenMessage(error.message, ScreenMessageType.ERROR);
        }
        const response = await AnalyzingService.getSellData(value);
        useAppResponse(res, new AppResponse(200)
            .setData(response));
    }
    catch (error) {
        catchAppError(error, res, 'Purchase Controller getProfitData');
    }
};
//# sourceMappingURL=analyzing.controller.js.map