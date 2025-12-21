import type { NextFunction, RequestHandler } from "express";
import { LRUCache } from "lru-cache";
import { Types } from "mongoose";


const cache = new LRUCache<string, string>({
  max: 100_000,
  ttl: 1000 * 60 * 60,
})

const userRefrence: (req: Req, res: Res, next: NextFunction)=> void = (req, res, next)=> {
  if (! req.body) req.body = {};
  if (! cache.has(req.ip!)) {
    cache.set(req.ip!, new Types.ObjectId().toHexString())
  }

  req.userRefrence = cache.get(req.ip!)!
  next()
}

export default userRefrence;