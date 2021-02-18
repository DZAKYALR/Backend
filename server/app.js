const express = require("express");
const app = express();
const port = 3000;
const routs = require("./routes/index");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(routs);
app.use(cors());

app.listen(port, () => {
  console.log("Listen Port :", port);
});
