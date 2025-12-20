import express from 'express'
import * as OrderController from './order.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.get('/store',  rateLimit(30, 1), Auth.getUser(true, true),   OrderController.getStore)
Router.get('/user',   rateLimit(3, 1), Auth.getUser(true, false),  OrderController.getUser)
Router.put('/accept', rateLimit(10, 1), Auth.getUser(true, true),   OrderController.acceptMany)
Router.put('/reject', rateLimit(10, 1), Auth.getUser(true, true),   OrderController.rejectMany)
Router.delete('/',    rateLimit(10, 1), Auth.getUser(true, false),  OrderController.remove)
Router.post('/',      rateLimit(30, 1), Auth.getUser(true, false),  OrderController.setDoneMany)


export default Router;