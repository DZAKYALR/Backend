const express = require("express");
const app = express();
const routs = require("./routes/index");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routs);
app.use(cors());

module.exports = app;
