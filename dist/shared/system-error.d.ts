export default class SystemError extends Error {
    static ErrorType: string;
    constructor(message: string);
    logDebug(debug: any): void;
    exit(statu: number): void;
}
export declare const catchSystemError: (error: any, source: string) => void;
//# sourceMappingURL=system-error.d.ts.map