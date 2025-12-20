import rateLimit from "express-rate-limit";
import AppResponse, { ScreenMessageType, useAppResponse } from "../shared/app-response.js";


export default function(requests: number, minuts: number, message?: string, skipFailedRequests?: boolean) {
  return rateLimit({
    windowMs: minuts * 60 * 1000,
    max: requests,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests,
    handler(req: Req, res: Res, next, options) {
      const retryAfter = Number(res.getHeader("Retry-After"));

      useAppResponse(res,
        new AppResponse(429)
        .setScreenMessage(message || `Too many requests: ${retryAfter}s`, ScreenMessageType.ERROR)
      )
    }
  })
}