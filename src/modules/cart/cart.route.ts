import express from 'express'
import * as CartController from './cart.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.get('/',            rateLimit(3,  1), Auth.getUser(true), CartController.get)
Router.post('/',           rateLimit(20, 1), Auth.getUser(true), CartController.addProduct)
Router.post('/byeAll',     rateLimit(10, 1), Auth.getUser(true), CartController.byeAll)
Router.delete('/',         rateLimit(20, 1), Auth.getUser(true), CartController.removeProduct)
Router.put('/encrement',   rateLimit(50, 1), Auth.getUser(true), CartController.encrement)
Router.put('/decrement',   rateLimit(50, 1), Auth.getUser(true), CartController.decrement)

export default Router;