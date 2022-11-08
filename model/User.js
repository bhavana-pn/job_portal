const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    //mongoose constraint for email
    unique: true,
    //mongoose constraint for email validation
    // validate: {
    //   validator: function (v) {
    //     return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid email!`,
    // },
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  experience: {
    type: String,
    // required: true,
  },
  skills: {
    type: String,
    // required: true,
  },
  basic: {
    type: String,
    // required: true,
  },
  master: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
