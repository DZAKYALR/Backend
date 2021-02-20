const { User, FlipCard, SetCard } = require("../models");
const { checkToken } = require("../helpers/jwt");

function authenticate(req, res, next) {
  console.log('authenticate');
  try {
    let decoded = checkToken(req.headers.access_token);
    User.findOne({
      where: {
        email: decoded.email,
      },
    })
      .then((userLogin) => {
          req.user = {
            id: +userLogin.id,
          };
          console.log('sini mas ?');
          next();
      })
      .catch((err) => {
        console.log('error di authen');
        throw err;
      });
  } catch (err) {
    next({ name: "unauthorize" });
  }
}

function authorizeFlipCard(req, res, next) {
  FlipCard.findOne({
    where: {
      id: +req.params.id,
    },
  })
    .then((data) => {
      if (!data.set_card_id) {
        next({
          name: "ResourceNotFound",
        });
      } else {
        SetCard.findOne({
          where: {
            id: data.set_card_id,
          },
        })
          .then((setCard) => {
            if (!setCard) {
              next({
                name: "ResourceNotFound",
              });
            } else {
              if (+req.user.id === +setCard.user_id) {
                req.setCard = {
                  id: +setCard.id,
                };
                next();
              }
            }
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function authorizeSetCard(req, res, next) {
  SetCard.findOne({
    where: {
      id: +req.params.id,
    },
  })
    .then((data) => {
      if (!data) {
        next({
          name: "ResourceNotFound",
        });
      } else {
        if (data.user_id === +req.user.id) {
          next();
        } else {
          next({
            name: "unauthorize",
          });
        }
      }
    })
    .catch((err) => {
      next(err);
    });
}

function authorizeUser(req, res, next) {
  console.log('authorrize');

  User.findOne({
    where: {
      id: +req.params.id,
    },
  })
    .then((data) => {
      console.log('here');
      if (!data) {
        console.log('hello');
        next({
          name: "ResourceNotFound",
        });
      } else {
        if (data.id === +req.user.id) {
          next();
        } else {
          next({
            name: "unauthorize",
          });
        }
      }
    })
    .catch((err) => {
      next(err);
    });
}
module.exports = {
  authenticate,
  authorizeSetCard,
  authorizeFlipCard,
  authorizeUser
};
