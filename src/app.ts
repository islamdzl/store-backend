import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

import RUserRoute from './modules/user/user.route.js'
import RLikeRoute from './modules/like/like.route.js'
import RUploadRoute from './modules/upload/upload.route.js'
import RStoreRoute from './modules/store/store.route.js'
import RProductRoute from './modules/product/product.route.js'
import ROrderRoute from './modules/order/order.route.js'
import RCategoryRoute from './modules/category/category.route.js'
import RCartRoute from './modules/cart/cart.route.js'
import RSearchRoute from './modules/search/search.route.js'
import RAnalyzeRoute from './modules/analyzenig/analyzing.route.js'

import JUpload from './modules/upload/upload.job.js'
import { UD } from './shared/statics.js';
const route = express.Router()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? '*',
  credentials: true
}))

route.use('/uploads', express.static(UD))
route.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

route.use((req, res, next)=> {
  if (! req.body) req.body = {};
  next()
})


route.use('/user', RUserRoute)
route.use('/like', RLikeRoute)
route.use('/upload', RUploadRoute)
route.use('/store', RStoreRoute)
route.use('/product', RProductRoute)
route.use('/order', ROrderRoute)
route.use('/category', RCategoryRoute)
route.use('/search', RSearchRoute)
route.use('/analyzing', RAnalyzeRoute)
route.use('/shopping-cart', RCartRoute)



const jobs: Function[] = [
  JUpload
]

jobs.forEach((j)=> j())

app.use('/api', route)

export default app;