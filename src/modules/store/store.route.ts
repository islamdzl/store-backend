import express from 'express'
import * as StoreController from './store.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()

Router.get('/', Auth.getUser(false),      StoreController.get)
Router.put('/', Auth.getUser(true, true) ,StoreController.update)

export default Router;