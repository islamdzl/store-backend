import express from 'express'
import UploadController from './upload.controller.js'
import * as Auth from '../../middlewares/auth.js'
const Router = express.Router()

Router.post('/', Auth.getUser(true, true), UploadController)

export default Router;