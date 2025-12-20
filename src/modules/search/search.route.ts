import express from 'express'
import * as SearchController from './search.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.post('/',        rateLimit(12, 1), Auth.getUser(false), SearchController.explore)
Router.post('/related', rateLimit(12, 1), Auth.getUser(false), SearchController.relqted)

export default Router;