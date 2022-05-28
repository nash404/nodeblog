const Users = require("./models/users").Users;
const Log = require("./models/log").Log;
const md5 = require("md5");
const config = require("./config/db");

const findSomething = require("./isThereSomething");
Log.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 });

const signIn = async (data) => {
  let find = await findSomething({ name: data.name });

  if (!find)
    return {
      token: "",
      errors: [{ type: "Error", text: "Has no account with this name" }],
    };

  const dataUsers = await Users.findOne({ name: data.name });
  let password = md5(data.password);

  if (password !== dataUsers.password)
    return {
      token: "",
      errors: [{ type: "Error", text: "Incorrect password" }],
    };
  const token = md5(dataUsers.name + Math.round(Math.random() * 100000));

  await Log.collection.insertOne({
    createdAt: new Date(),
    name: data.name,
    token: token,
    logMessage: "",
  });

  return { token: token, errors: [{ type: "Success", text: "Yo" }] };
};

module.exports = signIn;
