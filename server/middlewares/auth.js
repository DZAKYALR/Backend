const { User } = require('../models')
const { checkToken } = require('../helpers/jwt')

function authenticate(req, res, next) {
  try {
    let decoded = checkToken(req.headers.access_token)
    User.findOne({
      where: { email: decoded.email }
    })
    .then(data => {
      if(!data) {
        next({ name: 'needLogin' })
      } else {
        req.user = data
        next()
      }
    })
    .catch(err => {
      next(err)
    })
  }
  catch(err) {
    next({ name: 'needLogin'})
  }
}

function authorize(req, res, next) {
  Todo.findOne({
    where: { id: req.params.id }
  })
  .then(data => {
    if(!data || data.user_id !== req.user.id) {
      next({ name: 'needAccess' })
    } else {
      next()
    }
  })
  .catch(err => {
    next(err)
  })
}

module.exports = {
  authenticate,
  authorize
}
