import express from 'express'
import * as UploadController from './upload.controller.js'
import * as Auth from '../../middlewares/auth.js'
import * as upload from '../../middlewares/upload.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.post('/',      rateLimit(10, 1), Auth.getUser(true, true), upload.Images.single('FILE'), UploadController.single)
Router.post('/many',  rateLimit(10, 1), Auth.getUser(true, true), upload.Images.any(),  UploadController.many)

export default Router;