import express from 'express'
import * as CategoryController from './category.controller.js'
import * as Auth from '../../middlewares/auth.js'
import rateLimit from '../../middlewares/rateLimit.js'
const Router = express.Router()

Router.get('/', rateLimit(3, 1), CategoryController.getAll)
Router.get('/category/:categoryId', rateLimit(10, 1), Auth.getUser(true, true), CategoryController.getCategory)
Router.get('/branch/:branchId',     rateLimit(10, 1), Auth.getUser(true, true), CategoryController.getBranch)
Router.post('/category',            rateLimit(10, 1), Auth.getUser(true, true), CategoryController.createCategory)
Router.post('/branch',              rateLimit(10, 1), Auth.getUser(true, true), CategoryController.createBranch)
Router.put('/category',             rateLimit(10, 1), Auth.getUser(true, true), CategoryController.updateCategory)
Router.put('/branch',               rateLimit(10, 1), Auth.getUser(true, true), CategoryController.updateBranch)
Router.delete('/category',          rateLimit(20, 1), Auth.getUser(true, true), CategoryController.removeCategory)
Router.delete('/branch',            rateLimit(20, 1), Auth.getUser(true, true), CategoryController.removeBranch)

export default Router;