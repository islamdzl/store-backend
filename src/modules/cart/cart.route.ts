import express from 'express'
import * as CartController from './cart.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()

Router.get('/ ', Auth.getUser(true), CartController.get)
Router.post('/ ',     Auth.getUser(true), CartController.addProduct)
Router.delete('/ ',   Auth.getUser(true), CartController.addProduct)

export default Router;