const mongoose = require("../libs/mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  nameOfAuthor: {
    type: String,
    require: true,
  },
  linkOfAva: {
    type: String,
    require: true,
  },
  filling: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  linkOfImg: {
    type: String,
    required: true,
  },
  idOfAuthor: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
});

exports.Content = mongoose.model("Content", schema);
