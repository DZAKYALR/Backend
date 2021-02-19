const express = require("express");
const app = express();
const routs = require("./routes/index");
const cors = require("cors");
const errorHandler = require('./middlewares/errorhandler')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routs);
app.use(cors());
app.use (errorHandler)

module.exports = app;
