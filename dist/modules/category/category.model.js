import mongoose, { SchemaTypes } from "mongoose";
const branchSchema = new mongoose.Schema({
    name: { type: SchemaTypes.String, required: true },
    icon: { type: SchemaTypes.String },
});
const catrgorieSchema = new mongoose.Schema({
    name: { type: SchemaTypes.String, required: true },
    icon: { type: SchemaTypes.String },
    branchs: { type: [branchSchema], default: [] }
});
const Category = mongoose.model('Category', catrgorieSchema);
export default Category;
//# sourceMappingURL=category.model.js.map