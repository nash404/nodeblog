const mongoose = require("mongoose");
const config = require("../config/db");

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
