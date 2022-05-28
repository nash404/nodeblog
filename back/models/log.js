const mongoose = require("../libs/mongoose"),
  Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

exports.Log = mongoose.model("Log", schema);
