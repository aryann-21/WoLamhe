const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      type: { type: String, required: true },
      text: { type: String, default: null },
    },
  ],
  total: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  paymentProof: { type: String, required: true },
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
