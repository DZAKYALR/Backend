const { User, Product } = require("../../models/index");

function cleanUser() {
  if (process.env.NODE_ENV == "test") {
    return User.destroy({ where: {} });
  }
}

module.exports = { cleanUser };
