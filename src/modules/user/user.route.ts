import express from 'express'
import * as UserController from './user.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()


Router.get('/',          rateLimit(12, 1), Auth.getUser(true), UserController.get)
Router.put('/',          rateLimit(10, 1), Auth.getUser(true), UserController.update)
Router.delete('/',       rateLimit(1 , 1), Auth.getUser(true), UserController.deleteAccount)
Router.post('/login',    rateLimit(3 , 5), UserController.login)
Router.post('/register', rateLimit(1 , 120), UserController.register)

export default Router;