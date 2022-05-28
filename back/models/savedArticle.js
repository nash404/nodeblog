const mongoose = require("../libs/mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const schema = new Schema({
  idOfUser: {
    type: String,
    required: true,
  },
  idOfArticle: {
    type: ObjectId,
    require: true,
  },
});

exports.SavedArticle = mongoose.model("SavedArticle", schema);
