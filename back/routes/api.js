const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Content = require("../models/content").Content;
const Log = require("../models/log").Log;
const SavedArticle = require("../models/savedArticle").SavedArticle;
const Users = require("../models/users").Users;
const findSomething = require("../isThereSomething");
const findAuthorizedUser = require("../logs");
const validation = require("../validationData");
const signIn = require("../signIn");
const cheerio = require("cheerio");
const md5 = require("md5");
const Subs = require("../models/subs").Subs;
const { ObjectId } = require("mongodb");
const Comments = require("../models/comments").Comments;
router.use(bodyParser.json());

router.post("/post/comments", async function (req, res) {
  let data = req.body.data;
  let isAuth = await findAuthorizedUser(data.token);
  if (!isAuth) {
    res.json({
      status: false,
      err: { type: "Error", text: "Log in to post comment" },
    });
    return;
  }

  if (data.text.length === 0) {
    res.json({ status: false, err: { type: "Error", text: "Input comment" } });
    return;
  }
  let logUser = await Log.findOne({ token: data.token });
  let user = await Users.findOne({ name: logUser.name });
  let today = new Date();
  let day = String(today.getDate()).padStart(2, "0"),
    month = String(today.getMonth() + 1).padStart(2, "0"),
    year = today.getFullYear();
  let hour = today.getHours(),
    minutes = today.getMinutes();
  await Comments.collection.insertOne({
    idOfArticle: ObjectId(data.idOfArticle),
    idOfUser: user._id,
    linkAva: user.img,
    name: user.name,
    date: `${day}.${month}.${year} at ${hour}:${minutes}`,
    text: data.text,
  });
  console.log(data);
  res.json({
    status: true,
    comments: await Comments.find({ idOfArticle: ObjectId(data.idOfArticle) }),
  });
});

router.post("/post/searchArticle", async function (req, res) {
  console.log(req.body.text);
  let content = await Content.find({ title: new RegExp(req.body.text, "i") });
  console.log(content);
  res.json(content);
});

router.get("/getSub", async function (req, res) {
  let isAuth = await findAuthorizedUser(req.query.token);
  if (!isAuth) {
    res.json([]);
    return;
  }

  let name = await Log.findOne({ token: req.query.token });

  let user = await Users.findOne({ name: name.name });

  let sub = await Subs.find({ idOfUser: user._id });

  let subs = [];

  console.log(await Users.findOne({ _id: sub[0].idOfChannel }));
  for (let item of sub) {
    let countSubs = await Subs.collection.count({
      idOfChannel: item.idOfChannel,
    });
    let userInfo = await Users.findOne({ _id: item.idOfChannel });
    subs.push({ img: userInfo.img, name: userInfo.name, count: countSubs });
  }

  res.json(subs);
});

router.get("/channelSub", async function (req, res) {
  let article = await Content.findOne({ nameOfAuthor: req.query.name });
  let allSubs = await Subs.collection.count({
    idOfChannel: article.idOfAuthor,
  });
  console.log(allSubs);
  let isAuth = await findAuthorizedUser(req.query.token);
  if (!isAuth) {
    res.json({
      text: "Subscribe",
      color: "#0094FF",
      count: allSubs,
    });
    return;
  }

  let dataOfUserFromLogs = await Log.findOne({
    token: req.query.token,
  });
  let dataOfUserFromUsers = await Users.findOne({
    name: dataOfUserFromLogs.name,
  });

  let checkSub = await Subs.find({
    idOfUser: ObjectId(dataOfUserFromUsers._id),
    idOfChannel: ObjectId(article.idOfAuthor),
  });
  console.log(checkSub);
  if (checkSub.length === 0) {
    res.json({
      text: "Subscribe",
      color: "#0094FF",
      count: allSubs,
    });
  } else {
    res.json({
      text: "Unsubscribe",
      color: "#9c9c9c",
      count: allSubs,
    });
  }
});

router.post("/post/subOrNot", async function (req, res) {
  let data = req.body.data;
  let isAuth = await findAuthorizedUser(data.token);
  if (!isAuth) {
    let allSubs = await Subs.collection.count({
      idOfChannel: ObjectId(data.id),
    });
    res.json({
      text: "Subscribe",
      color: "#0094FF",
      count: allSubs,
      errors: [{ type: "Error", text: "Log in to sub" }],
    });
    return;
  }
  let dataOfUserFromLogs = await Log.findOne({
    token: data.token,
  });
  let dataOfUserFromUsers = await Users.findOne({
    name: dataOfUserFromLogs.name,
  });

  let checkSub = await Subs.find({
    idOfUser: ObjectId(dataOfUserFromUsers._id),
    idOfChannel: ObjectId(data.id),
  });

  if (checkSub.length !== 0) {
    await Subs.collection.deleteMany({
      idOfUser: ObjectId(dataOfUserFromUsers._id),
      idOfChannel: ObjectId(data.id),
    });
    let allSubs = await Subs.collection.count({
      idOfChannel: ObjectId(data.id),
    });

    res.json({
      text: "Subscribe",
      color: "#0094FF",
      count: allSubs,
      errors: [{ type: "Success", text: "Deleted" }],
    });
    return;
  }

  await Subs.collection.insertOne({
    idOfUser: ObjectId(dataOfUserFromUsers._id),
    idOfChannel: ObjectId(data.id),
  });
  let allSubs = await Subs.collection.count({
    idOfChannel: ObjectId(data.id),
  });

  res.json({
    text: "Unsubscribe",
    color: "#C9C9C9",
    count: allSubs,
    errors: [{ type: "Success", text: "Sub" }],
  });
});

router.get("/comments", async function (req, res) {
  let comments = await Comments.find({ idOfArticle: ObjectId(req.query.id) });
  res.json(comments);
});

router.get("/article", async function (req, res) {
  let article = await Content.findOne({ _id: ObjectId(req.query.id) });

  res.json({ art: article });
});

router.get("/channel", async function (req, res) {
  let article = await Content.find({ nameOfAuthor: req.query.name });

  res.json(article);
});

router.get("/content", async function (req, res) {
  console.log("con");
  let result;
  result = await Content.find();
  res.json(result);
});

router.get("/saved", async function (req, res) {
  let result = await findAuthorizedUser(req.query.name);
  let savedArticle = [];
  if (result) {
    let names = await Log.findOne({ token: req.query.name });

    let saved = await SavedArticle.find({ idOfUser: names.name });

    for (let item of saved) {
      let itemFromDb = await Content.findOne({ _id: item.idOfArticle });

      savedArticle.push(itemFromDb);
    }

    res.json(savedArticle);
    return;
  }

  res.json([]);
});

router.post("/post/signUpUser/", async function (req, res) {
  let dataOfUser = req.body.data;

  let state = await validation(dataOfUser);

  if (!state.status) {
    res.json(state.errors);
    return;
  }
  let find = await findSomething({ name: req.body.data.name });

  if (find) {
    res.json([
      { type: "Error", text: "There is already a user with the same name" },
    ]);
    return;
  }
  Users.collection.insertOne({
    name: dataOfUser.name,
    password: md5(dataOfUser.password),
    email: dataOfUser.email,
    img: "https://i.imgur.com/x60DPMl.png",
  });

  res.json([{ type: "Success", text: "Account created" }]);
});

router.post("/post/signInUser/", async function (req, res) {
  let dataOfUser = req.body.data;

  let result = await signIn(dataOfUser);
  res.json(result);
});

router.get("/post/findAuthorizedUser", async function (req, res) {
  let isAuth = await findAuthorizedUser(req.query.logMessage);

  if (isAuth) {
    let dataOfUserFromLogs = await Log.findOne({
      token: req.query.logMessage,
    });
    let dataOfUserFromUsers = await Users.findOne({
      name: dataOfUserFromLogs.name,
    });

    res.json([
      { name: dataOfUserFromUsers.name, img: dataOfUserFromUsers.img },
    ]);
    return;
  }

  res.json(["none"]);
});

router.post("/post/setSavedArticle", async function (req, res) {
  let dataOfUserAndArticle = req.body.data;

  let isAuth = await findAuthorizedUser(dataOfUserAndArticle.token);

  if (!isAuth) {
    res.json([{ type: "Error", text: "Log in to save article" }]);
    return;
  }

  let getName = await Log.findOne({ token: dataOfUserAndArticle.token });
  let getArticle = await SavedArticle.find({
    idOfUser: getName.name,
    idOfArticle: dataOfUserAndArticle.id,
  });

  if (getArticle.length === 0) {
    SavedArticle.collection.insertOne({
      idOfUser: getName.name,
      idOfArticle: ObjectId(dataOfUserAndArticle.id),
    });
    res.json([{ type: "Success", text: "Article is saved" }]);
    return;
  }

  res.json([{ type: "Error", text: "Article is already saved" }]);
});

router.post("/post/deleteArticle", async function (req, res) {
  let data = req.body.data;
  let isAuth = await findAuthorizedUser(data.token);
  if (!isAuth) {
    res.json([{ type: "Error", text: "Log in to delete article" }]);
  }
  let userData = await Log.findOne({ token: data.token });

  SavedArticle.collection.deleteOne({
    idOfUser: userData.name,
    idOfArticle: ObjectId(data.idOfArticle),
  });
  res.json([{ type: "Success", text: "Article was deleted" }]);
});

router.post("/post/editorCheck", async function (req, res) {
  let token = req.body.token;
  let isAuth = await findAuthorizedUser(token);
  if (!isAuth) {
    res.json([{ status: false }]);
  }
});

router.post("/post/article", async function (req, res) {
  let data = req.body.data;
  let foundName = await Log.findOne({ token: data.token });
  const html = cheerio.load(data.html);
  if (!foundName) {
    res.json([{ type: "Error", text: "Log in" }]);
    return;
  }
  if (!html("img")[0]) {
    res.json([{ type: "Error", text: "You have to add just one picture" }]);
    return;
  }

  if (data.title.length === 0) {
    res.json([{ type: "Error", text: "Input title of article" }]);
    return;
  }

  if (data.discription.length < 200) {
    res.json([{ type: "Error", text: "Your article has little text" }]);
    return;
  }

  let foundUser = await Users.findOne({ name: foundName.name });
  let today = new Date();
  let day = String(today.getDate()).padStart(2, "0"),
    month = String(today.getMonth() + 1).padStart(2, "0"),
    year = today.getFullYear();
  let hour = today.getHours(),
    minutes = today.getMinutes();
  const articleData = {
    title: data.title,
    tags: "Some,any,idk",
    nameOfAuthor: foundUser.name,
    linkOfAva: foundUser.img,
    filling: data.html,
    date: `${day}.${month}.${year} at ${hour}:${minutes}`,
    discription: data.discription,
    linkOfImg: html("img")[0].attribs.src,
    idOfAuthor: foundUser._id,
    likes: Math.round(Math.random() * 1000),
  };
  Content.collection.insertOne(articleData);
  res.json([{ type: "Success", text: "Article is added" }]);
});

module.exports = router;
