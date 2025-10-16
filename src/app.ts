import express from 'express';

const app = express();

import UserRoute from './modules/store/store.route.js'
import UploadRoute from './modules/store/store.route.js'
import StoreRoute from './modules/store/store.route.js'
import ProductRoute from './modules/product/product.route.js'
import OrderRoute from './modules/order/order.route.js'
import CategoryRoute from './modules/order/order.route.js'
import CartRoute from './modules/order/order.route.js'

app.use('/user', UserRoute)
app.use('/upload', UploadRoute)
app.use('/store', StoreRoute)
app.use('/product', ProductRoute)
app.use('/order', OrderRoute)
app.use('/category', CategoryRoute)
app.use('/shopping-cart', CartRoute)

export default app;