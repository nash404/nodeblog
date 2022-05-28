const mongoose = require("../libs/mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const schema = new Schema({
  idOfArticle: {
    type: ObjectId,
    required: true,
  },
  idOfUser: {
    type: ObjectId,
    required: true,
  },
  linkAva: {
    type: String,
  },
  name: {
    type: String,
  },
  date: {
    type: String,
  },
  text: {
    type: String,
  },
});

exports.Comments = mongoose.model("Comments", schema);
