import mongoose, { SchemaTypes } from "mongoose";

const uploadSchema = new mongoose.Schema<Upload>({
  destination: {type: SchemaTypes.String},
  directory: {type: SchemaTypes.String},
  filename: {type: SchemaTypes.String},
  mimetype: {type: SchemaTypes.String},
  process: {type: SchemaTypes.String},
  userId: {type: SchemaTypes.ObjectId},
}, {
  timestamps: true
})

const Upload = mongoose.model<Upload>('Upload', uploadSchema)

export default Upload;