const mongoose = require("../libs/mongoose"),
  Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },

  img: {
    type: String,
    require: true,
    default: "https://i.imgur.com/x60DPMl.png",
  },
});

exports.Users = mongoose.model("Users", schema);
