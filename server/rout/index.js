const routs = require("express").Router();

routs.get("/", (req, res) => {
  res.send("WELCOME");
});

module.exports = routs;
