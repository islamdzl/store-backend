import mongoose, { Mongoose, SchemaTypes } from "mongoose";
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
const typesSchema = new mongoose.Schema({
    key: { type: SchemaTypes.String },
    val: { type: SchemaTypes.String }
});
const orderSchema = new mongoose.Schema({
    userId: { type: SchemaTypes.ObjectId },
    productPrice: { type: SchemaTypes.Number, required: true },
    deliveryPrice: { type: SchemaTypes.Number, required: true },
    promo: { type: SchemaTypes.Number, required: true },
    product: { type: SchemaTypes.ObjectId, required: true, ref: 'Product' },
    status: { type: SchemaTypes.String, required: true },
    count: { type: SchemaTypes.Number, required: true },
    message: { type: SchemaTypes.String },
    color: { type: SchemaTypes.String },
    types: [typesSchema],
    buyingDetails: buyingDetailsSchema,
}, {
    timestamps: true
});
const Order = mongoose.model('Order', orderSchema);
export default Order;
//# sourceMappingURL=order.model.js.map