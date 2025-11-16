import express from 'express';
import * as LikeController from './like.controller.js';
import * as Auth from '../../middlewares/auth.js';
const Router = express.Router();
Router.get('/', Auth.getUser(true), LikeController.get);
Router.post('/', Auth.getUser(true), LikeController.create);
Router.delete('/', Auth.getUser(true), LikeController.remove);
export default Router;
//# sourceMappingURL=like.route.js.map