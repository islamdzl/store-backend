import express from 'express';
export declare enum ScreenMessageType {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
export default class AppResponse extends Error {
    private response;
    constructor(statuCode: number);
    reLogIn(): this;
    setScreenMessage(message: string, type: ScreenMessageType): this;
    setResponseFile(buffer: Buffer, fileName: string): this;
    runCommand(command: string, data: any): this;
    setData(data: any): this;
    Execute(res: express.Response): unknown;
}
export declare const useAppResponse: (res: Res, response: any) => void;
export declare const catchAppError: (error: any, res: Res, source?: string) => void;
//# sourceMappingURL=app-response.d.ts.map