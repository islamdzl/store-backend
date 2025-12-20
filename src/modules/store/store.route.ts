import express from 'express'
import rateLimit from '../../middlewares/rateLimit.js'
import * as StoreController from './store.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()


Router.get('/', rateLimit(12, 1), Auth.getUser(false),      StoreController.get)
Router.put('/', rateLimit(20, 1), Auth.getUser(true, true) ,StoreController.update)

export default Router;