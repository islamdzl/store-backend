import mongoose, { SchemaTypes } from 'mongoose';
const purchaseSchema = new mongoose.Schema({
    productId: { type: SchemaTypes.ObjectId, required: true },
    deliveryPrice: { type: SchemaTypes.Number, required: true },
    productPrice: { type: SchemaTypes.Number, required: true },
    count: { type: SchemaTypes.Number, required: true },
    client: { type: SchemaTypes.ObjectId },
}, {
    timestamps: true
});
const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
//# sourceMappingURL=purchase.model.js.map