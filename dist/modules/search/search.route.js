import express from 'express';
import * as SearchController from './search.controller.js';
import * as Auth from '../../middlewares/auth.js';
const Router = express.Router();
Router.post('/', Auth.getUser(false), SearchController.explore);
export default Router;
//# sourceMappingURL=search.route.js.map