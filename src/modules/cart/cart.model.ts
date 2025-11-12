import mongoose, { SchemaTypes } from 'mongoose';

const cartSchema = new mongoose.Schema<Cart>({
  count: { type: SchemaTypes.Number, required: true},
  ownerId: { type: SchemaTypes.ObjectId, required: true},
  product: { type: SchemaTypes.ObjectId, ref: 'Product', required: true},
})

const Cart = mongoose.model<Cart>('Cart', cartSchema)

export default Cart;