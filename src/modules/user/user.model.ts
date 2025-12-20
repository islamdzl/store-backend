import mongoose, { SchemaTypes } from 'mongoose';

const buyingDetailsSchema = new mongoose.Schema<User.BuyingDetails>({
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
})

const userSchema = new mongoose.Schema<User>({
  email: { type: SchemaTypes.String, required: true },
  picture: { type: SchemaTypes.String, required: true },
  password: { type: SchemaTypes.String, required: true },
  username: { type: SchemaTypes.String, required: true },
  buyingDetails: { type: buyingDetailsSchema, default: null },
})

const User = mongoose.model<User>('user', userSchema)

export default User;