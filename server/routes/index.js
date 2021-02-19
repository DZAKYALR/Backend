const routs = require("express").Router();
const authController = require("../controllers/authController")
const ControllerFlipCard = require("../controllers/cardController") 
const { authenticate } = require('../middlewares/auth')
const { authorize } = require('../middlewares/auth')

routs.get("/", (req, res) => {
  res.send("WELCOME");
});

routs.post("/login", authController.login)
routs.post("/register", authController.register)
routs.get("/user/:id", authController.getUser)
routs.use(authenticate) //done
routs.get("/cards", ControllerFlipCard.findAllFlipCard) //done
routs.post("/cards", ControllerFlipCard.insert)  //done
routs.get("/cards/user/:id", ControllerFlipCard.findFlipCardById)  //done
routs.get("/cards/category/:query", ControllerFlipCard.findFlipCardByCategory)   //done
routs.get("/cards/title/:query", ControllerFlipCard.findFlipCardByTitle)   //done
routs.put("/cards/:id", authorize, ControllerFlipCard.update)    //done
routs.delete("/cards/:id", authorize, ControllerFlipCard.delete)    //done


module.exports = routs;
