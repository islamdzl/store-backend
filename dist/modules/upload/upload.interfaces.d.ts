declare global {
    interface Upload {
        _id: ID;
        userId: ID;
        destination: string;
        directory: string;
        filename: string;
        mimetype: string;
        process: string;
        createdAt: Date;
        updatedAt: Date;
    }
    namespace Upload {
        enum ProcessType {
            ICON = "ICON",
            LOGO = "LOGO",
            BANNER = "BANNER",
            PRODUCT_IMAGE = "PRODUCT_IMAGE",
            PRODUCT_IMAGE_PREVIEW = "PRODUCT_IMAGE_PREVIEW"
        }
        interface Declare extends Partial<Upload> {
        }
        interface Request {
            process: ProcessType;
        }
        interface ExecuteResult {
            id: ID;
            path: string;
        }
        namespace SaveFile {
            interface ExecuteResult {
                removed: Upload[];
                saved: Upload[];
                processTime: number;
                getRemoved: (() => Upload[]);
                getSaved: (() => Upload[]);
                getSavedPaths: (() => string[]);
            }
        }
    }
}
export {};
//# sourceMappingURL=upload.interfaces.d.ts.map