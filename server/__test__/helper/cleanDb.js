const { User, SetCard } = require("../../models/index");

function cleanUser() {
  if (process.env.NODE_ENV == "test") {
    return User.destroy({ where: {} });
  }
}

function cleanSetCard() {
  if (process.env.NODE_ENV == "test") {
    return SetCard.destroy({ where: {} });
  }
}

module.exports = { cleanUser, cleanSetCard };
