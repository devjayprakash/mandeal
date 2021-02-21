let mongoose = require("mongoose");

let Bid = mongoose.Schema({
  timestamp: {
    type: Number,
    required: true,
  },

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },

  createdFor: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },

  product: {
    type: mongoose.Types.ObjectId,
    ref: "product",
    required: true,
  },

  amount: {
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
});

module.exports = mongoose.model("bid", Bid);
