import express from 'express';
import * as CategoryController from './category.controller.js';
import * as Auth from '../../middlewares/auth.js';
const Router = express.Router();
Router.get('/', CategoryController.getAll);
Router.get('/category/:categoryId', Auth.getUser(true, true), CategoryController.getCategory);
Router.get('/branch/:branchId', Auth.getUser(true, true), CategoryController.getBranch);
Router.post('/category', Auth.getUser(true, true), CategoryController.createCategory);
Router.post('/branch', Auth.getUser(true, true), CategoryController.createBranch);
Router.put('/category', Auth.getUser(true, true), CategoryController.updateCategory);
Router.put('/branch', Auth.getUser(true, true), CategoryController.updateBranch);
Router.delete('/category', Auth.getUser(true, true), CategoryController.removeCategory);
Router.delete('/branch', Auth.getUser(true, true), CategoryController.removeBranch);
export default Router;
//# sourceMappingURL=category.route.js.map