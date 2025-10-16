import mongoose, { SchemaTypes } from "mongoose";
import * as UploadInterfaces from './upload.interfaces.js'

const uploadSchema = new mongoose.Schema<Upload>({
  destination: {type: SchemaTypes.String},
  directory: {type: SchemaTypes.String},
  filename: {type: SchemaTypes.String},
  path: {type: SchemaTypes.String},
  mimetype: {type: SchemaTypes.String},
  size: {type: SchemaTypes.Number},
  process: {type: SchemaTypes.String},
  userId: {type: SchemaTypes.ObjectId},
})

const Upload = mongoose.model<Upload>('Upload', uploadSchema)

export default Upload;