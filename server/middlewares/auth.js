const { User, FlipCard, SetCard } = require("../models");
const { checkToken } = require("../helpers/jwt");

function authenticate(req, res, next) {
  try {
    let decoded = checkToken(req.headers.access_token);
    User.findOne({
      where: {
        email: decoded.email,
      },
    })
      .then((userLogin) => {
        if (userLogin !== null) {
          req.user = {
            id: +userLogin.id,
          };
          next();
        } else {
          next('unidentified user');
        }
       
      })
      .catch((err) => {
        next(err);
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
      SetCard.findOne({
        where: {
          id: data.set_card_id,
        },
      })
        .then((setCard) => {
          if (+req.user.id === +setCard.user_id) {
            req.setCard = {
              id: +setCard.id,
            };
            next()
          }
        })
        .catch((err) => {
          next(err);
        });
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
      if (data.user_id === +req.user.id) {
        next()
      } else {
        next({
          name: "unauthorize",
        })
      }
    })
    .catch((err) => {
      next(err)
    });
}

function authorizeUser(req, res, next) {
  User.findOne({
    where: {
      id: +req.params.id,
    },
  })
    .then((data) => {
      if (data.id === +req.user.id) {
        next();
      } else {
        next({
          name: "unauthorize",
        });
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
