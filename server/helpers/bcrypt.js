const bcrypt = require('bcryptjs')

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

function checkPassword(password, dbPassword) {
  return bcrypt.compareSync(password, dbPassword)
}

module.exports = {
  hashPassword,
  checkPassword
}
