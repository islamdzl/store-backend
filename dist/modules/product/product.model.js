import mongoose, { SchemaTypes } from "mongoose";
const classificationSchema = new mongoose.Schema({
    category: { type: SchemaTypes.ObjectId, required: true },
    branch: { type: SchemaTypes.ObjectId, required: false },
}, {
    _id: false
});
const keyValSchema = new mongoose.Schema({
    key: SchemaTypes.String,
    val: SchemaTypes.String,
}, {
    _id: false
});
const typeSchema = new mongoose.Schema({
    typeName: { type: SchemaTypes.String, required: true },
    values: [SchemaTypes.String],
}, {
    _id: false
});
const productSchema = new mongoose.Schema({
    name: { type: SchemaTypes.String, required: true },
    price: { type: SchemaTypes.Number, required: true },
    promo: { type: SchemaTypes.Number, default: 0 },
    quantity: { type: SchemaTypes.Number, default: null },
    description: { type: SchemaTypes.String, default: '' },
    images: { type: [SchemaTypes.String], required: true },
    isActive: { type: SchemaTypes.Boolean, default: true },
    requests: { type: SchemaTypes.Number, default: 0 },
    delivery: { type: SchemaTypes.Number, default: null, },
    classification: { type: classificationSchema, required: true },
    keyVal: [keyValSchema],
    colors: [SchemaTypes.String],
    types: [typeSchema]
}, {
    timestamps: true
});
const Product = mongoose.model('Product', productSchema);
export default Product;
//# sourceMappingURL=product.model.js.map