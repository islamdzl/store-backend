import type { ClientSession } from 'mongoose';
export declare const reProcess: (UDPath: string, processType: Upload.ProcessType, force?: boolean) => Promise<void>;
export declare const copyFile: (UDSrc: string, UDDist: string, newName?: string, force?: boolean) => Promise<void>;
export declare const removeFile: (UDPath: string, force?: boolean) => Promise<void>;
export declare const declareFile: (file: Express.Multer.File, user: User, process: Upload.ProcessType) => Promise<Upload>;
export declare const uploadFile: (filePath: string, processType: Upload.ProcessType) => Promise<(file: Express.Multer.File, user: User, process: Upload.ProcessType) => Promise<Upload>>;
export default class SaveFile {
    private _staticFile;
    private _processType;
    private _requiredSavedResults;
    private _ignoreOldProcessType;
    private _listIgnoreRemove;
    private _saveFilesIds;
    private _saveFilesPaths;
    private _removeFilesIds;
    private _removeFilesPaths;
    private _processTimeStart?;
    private _processTimeEnd?;
    private _session?;
    private _userId?;
    private _destinationDirectory;
    constructor();
    saveFilesIds(ids: ID[]): this;
    saveFilesPaths(paths: string[]): this;
    removeFilesIds(ids: ID[]): this;
    removeFilesPaths(paths: string[]): this;
    processType(processType: string): this;
    destinationDirectory(directory: string, ymd?: boolean): this;
    session(session: ClientSession): this;
    staticFile(filename: string): this;
    setStartProcessTime(time: number): this;
    force(savedResults?: number): this;
    ignoreOldProcessType(): this;
    ignoreRemoveIndexes(indexes: number[], toIndex?: number): this;
    user(userId: ID): this;
    /**
     * - Exeute process
     * @returns {Promise<Upload.ExecuteResult>}
     */
    Execute(): Promise<Upload.SaveFile.ExecuteResult>;
}
//# sourceMappingURL=upload.service.d.ts.map