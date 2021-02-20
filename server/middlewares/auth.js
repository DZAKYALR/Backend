const { User, FlipCard, SetCard } = require("../models");
const { checkToken } = require("../helpers/jwt");

function authenticate(req, res, next) {
  console.log("auth nih");
  try {
    let decoded = checkToken(req.headers.access_token);
    User.findOne({
      where: {
        email: decoded.email,
      },
    })
      .then((userLogin) => {
        console.log("auth 2");
        if (!userLogin) {
          next({ name: "unauthorize" });
        } else {
          console.log("auth 3");
          req.user = {
            id: +userLogin.id,
          };
          next();
        }
      })
      .catch((err) => {
        console.log("auth 4");
        next(err);
      });
  } catch (err) {
    console.log("auth 5");
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
  console.log("masuk ke auth");
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
          console.log("unauthorize");
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
};
