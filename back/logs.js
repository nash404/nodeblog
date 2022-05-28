const Log = require("./models/log").Log;

const findAuthorizedUser = async (data) => {
  let result = await Log.findOne({ token: data });

  if (!result) return false;
  else return true;
};

module.exports = findAuthorizedUser;
