const express = require("express");
const cors = require("cors");
const api = require("./routes/api");
const app = express();
const PORT = 8000;

app.use(cors());
app.use("/api", api);
app.use(express.static("public"));

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error, server did not start: " + err);
    return;
  }
  console.log("Success, server started");
});
