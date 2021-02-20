let mongoose = require("mongoose");

let Product = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  description: {
    type: String,
    required: true,
  },
  mppk: {
    //this is minimun price per kg
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  images: String,
});

module.exports = mongoose.model("product", Product);
