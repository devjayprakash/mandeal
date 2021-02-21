let mongoose = require("mongoose");

let User = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  accountCreationDate: Date,
  lastLoginDate: Date,
  profilePic: String,
});

module.exports = mongoose.model("user", User);
