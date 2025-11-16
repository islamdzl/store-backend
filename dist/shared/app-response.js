import express from 'express';
import logger from './logger.js';
import SystemError, { catchSystemError } from './system-error.js';
export var ScreenMessageType;
(function (ScreenMessageType) {
    ScreenMessageType["INFO"] = "INFO";
    ScreenMessageType["WARN"] = "WARN";
    ScreenMessageType["ERROR"] = "ERROR";
})(ScreenMessageType || (ScreenMessageType = {}));
export default class AppResponse extends Error {
    response = {};
    constructor(statuCode) {
        super('');
        this.response.statuCode = statuCode;
    }
    reLogIn() {
        this.response.execute = {
            action: "redirect",
            data: "/login"
        };
        return this;
    }
    setScreenMessage(message, type) {
        this.response.screenMessage = {
            message, type
        };
        return this;
    }
    setResponseFile(buffer, fileName) {
        this.response.responseFile = {
            buffer, fileName
        };
        return this;
    }
    runCommand(command, data) {
        this.response.execute = {
            data, action: command
        };
        return this;
    }
    setData(data) {
        this.response.data = data;
        return this;
    }
    Execute(res) {
        res.status(this.response.statuCode);
        const response = {
            success: (this.response.statuCode <= 300),
            ...this.response
        };
        try {
            res.json(response);
            return false;
        }
        catch (e) {
            return e;
        }
    }
}
export const useAppResponse = (res, response) => {
    if (response instanceof AppResponse) {
        const error = response.Execute(res);
        if (error) {
            logger.error({ message: 'Error in Execute AppResponse', error });
        }
    }
};
export const catchAppError = (error, res, source) => {
    if (error instanceof AppResponse) {
        error.Execute(res);
        return;
    }
    useAppResponse(res, new AppResponse(500)
        .setScreenMessage('System Error', ScreenMessageType.ERROR));
    if (source) {
        catchSystemError(error, source);
    }
};
//# sourceMappingURL=app-response.js.map