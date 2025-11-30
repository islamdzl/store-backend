import express from 'express';
import * as AnalyzeController from './analyzing.controller.js';
import * as Auth from '../../middlewares/auth.js';
const Router = express.Router();
Router.get('/sell', Auth.getUser(true, true), AnalyzeController.getSell);
Router.get('/profit', Auth.getUser(true, true), AnalyzeController.getProfitData);
export default Router;
//# sourceMappingURL=analyzing.route.js.map