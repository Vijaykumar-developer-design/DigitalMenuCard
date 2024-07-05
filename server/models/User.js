const mongoose = require("mongoose");
const { Schema } = mongoose;
const itemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new Schema({
  items: { type: [itemSchema], required: true },
  note: { type: String },
  tableNumber: { type: String, required: true },
  orderedTime: { type: Date, required: true },
  totalBill: { type: String },
  completed: { type: Boolean, default: false },
});

const userSchema = new Schema({
  userId: { type: String },
  hotelName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orders: [orderSchema], // Orders array with nested orderSchema
});

const postSchema = new Schema(
  {
    userId: { type: String },
    uploadImage: { type: String },
    name: { type: String },
    price: { type: String },
    publicId: { type: String, required: true }, //for getting num of likes when fetching data on ui
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("HotelUser", userSchema);
const PostModel = mongoose.model("HotelPost", postSchema);
module.exports = { UserModel, PostModel };
