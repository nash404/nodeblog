const mongoose = require("../libs/mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const schema = new Schema({
  idOfUser: {
    type: ObjectId,
  },
  idOfChannel: {
    type: ObjectId,
  },
});

exports.Subs = mongoose.model("Subs", schema);
