import express from 'express'
import * as ProductController from './product.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()

Router.get('/:productId', Auth.getUser(false), ProductController.get)
Router.post('/bye',     Auth.getUser(false), ProductController.bye)
Router.post('/byeMany', Auth.getUser(false), ProductController.byeMany)
Router.post('/',        Auth.getUser(true, true), ProductController.create)
Router.put('/',         Auth.getUser(true, true), ProductController.update)
Router.delete('/',      Auth.getUser(true, true), ProductController.remove)

export default Router;