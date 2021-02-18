const routs = require("express").Router();
const productController = require("../controllers/authController")

routs.get("/", (req, res) => {
  res.send("WELCOME");
});

routs.post("/login", productController.login)
routs.post("/register", productController.register)
routs.get("/user/:id", productController.getUser)

module.exports = routs;
