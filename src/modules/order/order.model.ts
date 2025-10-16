import mongoose, { SchemaTypes } from "mongoose";


const orderSchema = new mongoose.Schema<Order>({
  userId: { type: SchemaTypes.ObjectId },
  totalPrice: { type: SchemaTypes.Number, required: true },
  product: { type: SchemaTypes.ObjectId, required: true },
  status: { type: SchemaTypes.String, required: true},
  count: { type: SchemaTypes.Number, required: true },
  message: { type: SchemaTypes.String },
  trackingCode: { type: SchemaTypes.String },
}, {
  timestamps: true
})

const Order = mongoose.model('Order', orderSchema);

export default Order;