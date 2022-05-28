const Users = require("./models/users").Users;

const findSomething = async (string) => {
  let result = await Users.findOne(string);

  if (!result) return false;
  else return true;
};

module.exports = findSomething;
