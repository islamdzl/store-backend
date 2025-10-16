import mongoose, { SchemaTypes } from "mongoose";

const productSchema = new mongoose.Schema<Product>({
  name: { type: SchemaTypes.String, required: true },
  price: { type: SchemaTypes.Number, required: true },
  promo: { type: SchemaTypes.Number, default: 0 },
  contity: { type: SchemaTypes.Number, default: -1 },
  description: { type: SchemaTypes.String, default: ''},
  images: { type: [SchemaTypes.String], required: true },
  isActive: { type: SchemaTypes.Boolean, default: true },
  requests: { type: SchemaTypes.Number, default: 0 },
})

const Product = mongoose.model<Product>('Product', productSchema)

export default Product;