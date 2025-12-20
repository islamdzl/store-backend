import express from 'express'
import * as ProductController from './product.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.get('/:productId', rateLimit(12, 1), Auth.getUser(false), ProductController.get)
Router.post('/bye',     rateLimit(5,  1, '', true), Auth.getUser(false), ProductController.bye)
Router.post('/byeMany', rateLimit(3,  1), Auth.getUser(false), ProductController.byeMany)
Router.post('/',        rateLimit(2,  1), Auth.getUser(true, true), ProductController.create)
Router.put('/',         rateLimit(6,  1), Auth.getUser(true, true), ProductController.update)
Router.delete('/',      rateLimit(30, 1), Auth.getUser(true, true), ProductController.remove)

export default Router;