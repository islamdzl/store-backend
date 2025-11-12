import mongoose, { SchemaTypes } from "mongoose";

const likeSchema = new mongoose.Schema<Like>({
  product: { type: SchemaTypes.ObjectId, required: true, ref: 'Product'},
  userId: { type: SchemaTypes.ObjectId, required: true },
}, {
  timestamps: true
})

const Like = mongoose.model('Like', likeSchema)

export default Like;