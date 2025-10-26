import express from 'express'
import UploadController from './upload.controller.js'
import * as Auth from '../../middlewares/auth.js'
import upload from '../../middlewares/upload.js'
const Router = express.Router()


Router.post('/', Auth.getUser(true, true), upload, UploadController)

export default Router;