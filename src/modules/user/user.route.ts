import express from 'express'
import * as UserController from './user.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()


Router.get('/',     Auth.getUser(true), UserController.get)
Router.put('/',     Auth.getUser(true), UserController.update)
Router.delete('/',  Auth.getUser(true), UserController.deleteAccount)
Router.post('/login',    UserController.login)
Router.post('/register', UserController.register)

export default Router;