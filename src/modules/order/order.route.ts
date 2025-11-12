import express from 'express'
import * as OrderController from './order.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()

Router.get('/store',  Auth.getUser(true, true),   OrderController.getStore)
Router.get('/user',   Auth.getUser(true, false),  OrderController.getUser)
Router.put('/accept', Auth.getUser(true, true),   OrderController.acceptMany)
Router.put('/reject', Auth.getUser(true, true),   OrderController.rejectMany)
Router.delete('/',    Auth.getUser(true, false),  OrderController.remove)
Router.post('/',      Auth.getUser(true, false),  OrderController.setDoneMany)


export default Router;