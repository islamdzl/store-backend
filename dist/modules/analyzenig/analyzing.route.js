import express from 'express';
import * as AnalyzeController from './analyzing.controller.js';
import * as Auth from '../../middlewares/auth.js';
const Router = express.Router();
Router.post('/sell', Auth.getUser(true, true), AnalyzeController.getSell);
Router.post('/profit', Auth.getUser(true, true), AnalyzeController.getProfitData);
Router.post('/', Auth.getUser(true, true), AnalyzeController.genral);
export default Router;
//# sourceMappingURL=analyzing.route.js.map