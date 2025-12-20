import express from 'express'
import * as AnalyzeController from './analyzing.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.post('/sell',    rateLimit(25,  1), Auth.getUser(true, true), AnalyzeController.getSell)
Router.post('/profite', rateLimit(25,  1), Auth.getUser(true, true), AnalyzeController.getProfitData)
Router.post('/',        rateLimit(10,  1), Auth.getUser(true, true), AnalyzeController.genral)

export default Router;  