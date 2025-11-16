import UserModel from '../modules/user/user.model.js';
import AppResponse, { catchAppError, ScreenMessageType } from "../shared/app-response.js";
import { isAdmin } from '../shared/services.js';
import { jwtVerify, jwtSign } from '../shared/utils.js';
export const getUser = (force, adminOnly) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.token;
            if (!force && !token) {
                return next();
            }
            if (!token) {
                throw new AppResponse(403)
                    .reLogIn();
            }
            const payload = await jwtVerify(token);
            if (!payload) {
                throw new AppResponse(403)
                    .reLogIn();
            }
            const user = await UserModel.findById(payload._id);
            if (!user) {
                throw new AppResponse(404)
                    .setScreenMessage('Account Not Found', ScreenMessageType.ERROR)
                    .reLogIn();
            }
            if (adminOnly && !isAdmin(user.email)) {
                throw new AppResponse(409)
                    .setScreenMessage('Forbiden', ScreenMessageType.ERROR);
            }
            req.user = user.toJSON();
            next();
        }
        catch (error) {
            catchAppError(error, res, 'Middlwares Auth getUser');
        }
    };
};
//# sourceMappingURL=auth.js.map