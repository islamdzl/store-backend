import mongoose, { SchemaTypes } from "mongoose";
const buyingDetailsSchema = new mongoose.Schema({
    city: { type: SchemaTypes.String },
    fullName: { type: SchemaTypes.String },
    phone1: { type: SchemaTypes.String },
    phone2: { type: SchemaTypes.String },
    note: { type: SchemaTypes.String },
    postalCode: { type: SchemaTypes.String },
    state: { type: SchemaTypes.Number },
    deliveryToHome: { type: SchemaTypes.Boolean },
}, {
    _id: false
});
const orderSchema = new mongoose.Schema({
    userId: { type: SchemaTypes.ObjectId },
    totalPrice: { type: SchemaTypes.Number, required: true },
    product: { type: SchemaTypes.ObjectId, required: true, ref: 'Product' },
    status: { type: SchemaTypes.String, required: true },
    count: { type: SchemaTypes.Number, required: true },
    message: { type: SchemaTypes.String },
    buyingDetails: buyingDetailsSchema,
    trackingCode: { type: SchemaTypes.String },
}, {
    timestamps: true
});
const Order = mongoose.model('Order', orderSchema);
export default Order;
//# sourceMappingURL=order.model.js.map