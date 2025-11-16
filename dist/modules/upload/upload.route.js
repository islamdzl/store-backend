import express from 'express';
import * as UploadController from './upload.controller.js';
import * as Auth from '../../middlewares/auth.js';
import * as upload from '../../middlewares/upload.js';
const Router = express.Router();
Router.post('/', Auth.getUser(true, true), upload.Images.single('FILE'), UploadController.single);
Router.post('/many', Auth.getUser(true, true), upload.Images.any(), UploadController.many);
export default Router;
//# sourceMappingURL=upload.route.js.map