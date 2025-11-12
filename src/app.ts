import express from 'express';
import path from 'path';
import cors from 'cors'

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

import JUpload from './modules/upload/upload.job.js'

app.use(cors({
  origin: '*' 
}))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use(express.json())
app.use((req, res, next)=> {
  if (! req.body) req.body = {};
  next()
})

app.use('/user', RUserRoute)
app.use('/like', RLikeRoute)
app.use('/upload', RUploadRoute)
app.use('/store', RStoreRoute)
app.use('/product', RProductRoute)
app.use('/order', ROrderRoute)
app.use('/category', RCategoryRoute)
app.use('/search', RSearchRoute)
app.use('/shopping-cart', RCartRoute)



const jobs: Function[] = [
  JUpload
]

jobs.forEach((j)=> j())


export default app;