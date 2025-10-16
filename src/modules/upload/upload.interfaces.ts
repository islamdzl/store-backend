

declare global {
  interface Upload extends Omit<Express.Multer.File, 
  'buffer' | 'fieldname' | 'originalname' | 'stream' | 'encoding'> {
    userId: ID;
    path: string;
    directory: string;
    process: string;
  }

  namespace Upload {


    enum ProcessType {
      LOGO = 'LOGO',
    }

    interface Request {
      process: ProcessType;
    }
    interface ExecuteResult {
      id: ID;
      path: string;
    }
  }
}