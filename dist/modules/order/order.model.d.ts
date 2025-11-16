import mongoose from "mongoose";
declare const Order: mongoose.Model<Order, {}, {}, {}, mongoose.Document<unknown, {}, Order, {}, mongoose.DefaultSchemaOptions> & Order & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<Order, mongoose.Model<Order, any, any, any, mongoose.Document<unknown, any, Order, any, {}> & Order & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Order, mongoose.Document<unknown, {}, mongoose.FlatRecord<Order>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Order> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Order;
//# sourceMappingURL=order.model.d.ts.map