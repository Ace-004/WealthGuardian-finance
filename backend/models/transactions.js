const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, trim: true, required: true },
    amount: { type: Number, min: 0, required: true },
    date: { type: Date, required: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
