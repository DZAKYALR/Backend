const routs = require("express").Router();
const authController = require("../controllers/authController")
const ControllerFlipCard = require("../controllers/cardController") 
const ControllerSetCard = require("../controllers/setCardController") 
const { authenticate } = require('../middlewares/auth')
const { authorizeFlipCard, authorizeSetCard } = require('../middlewares/auth')

routs.get("/", (req, res) => {
  res.send("Welcome :)");
});

routs.post("/login", authController.login)
routs.post("/register", authController.register)
routs.get("/user/:id", authController.getUser)
routs.use(authenticate)

routs.get("/cards/:set_card_id", ControllerFlipCard.findBySetCardId)  //done
routs.post("/cards/:set_card_id", ControllerFlipCard.insert)  //done
routs.put("/cards/:id", authorizeFlipCard, ControllerFlipCard.update)   //done 
routs.delete("/cards/:id", authorizeFlipCard, ControllerFlipCard.delete)   //done  

routs.get("/setcard", ControllerSetCard.findAll) //done
routs.post("/setcard", ControllerSetCard.insert) //done
routs.get("/setcard/:query", ControllerSetCard.findSetCardByTitle) //done
routs.put("/setcard/:id", authorizeSetCard, ControllerSetCard.update)   //done
routs.delete("/setcard/:id", authorizeSetCard, ControllerSetCard.delete)   //done


module.exports = routs;
