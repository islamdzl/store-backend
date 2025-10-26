import mongoose, { SchemaTypes } from "mongoose";

const likeSchema = new mongoose.Schema<Like>({
  productId: { type: SchemaTypes.ObjectId, required: true },
  userId: { type: SchemaTypes.ObjectId, required: true },
  preview: { type: SchemaTypes.String, required: true },
}, {
  timestamps: true
})

const Like = mongoose.model('Like', likeSchema)

export default Like;