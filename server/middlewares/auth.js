const { User, FlipCard } = require('../models')
const { checkToken } = require('../helpers/jwt')

function authenticate(req, res, next)  {
  console.log('auth nih')
  try {
    let decoded = checkToken(req.headers.access_token)
    User.findOne({
      where : {
        email: decoded.email 
      }
    })
    .then(userLogin => {
      console.log('auth 2')
      if (!userLogin) {
        next({ name: "unauthorize" })
      } else {
        console.log('auth 3')
        req.user = {
            id: +userLogin.id
        }
        next()
      }
    })
    .catch(err => {
      console.log('auth 4')
      next(err)
    })
    
  } catch (err) {
    console.log('auth 5')
    next({ name: "unauthorize" })
      
  }
}

function authorize(req, res, next) {
  console.log('masuk ke auth');
  FlipCard.findOne({
      where : {
          id: +req.params.id
      }
  })
  .then(data => {
      if (!data) {
          next({
              name: "ResourceNotFound" 
          })
      } else {
          if (data.user_id === +req.user.id) {
              next()
          } else {
              console.log('unauthorize');
              next({
                  name: "unauthorize" 
              })
          }
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
