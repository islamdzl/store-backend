import express from 'express'
import * as SearchController from './search.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()

Router.post('/',        Auth.getUser(false), SearchController.explore)
Router.post('/related', Auth.getUser(false), SearchController.relqted)

export default Router;