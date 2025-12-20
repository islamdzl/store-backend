import express from 'express'
import * as LikeController from './like.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.get('/',     rateLimit(3,  1), Auth.getUser(true),   LikeController.get)
Router.post('/',    rateLimit(20, 1), Auth.getUser(true),   LikeController.create)
Router.delete('/',  rateLimit(20, 1), Auth.getUser(true),   LikeController.remove)

export default Router;