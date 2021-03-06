const { User } = require("../models");
const { checkPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { sendEmail } = require('../helpers/nodeMailer')

class authController {
  static getUser(req, res, next) {
    const id = +req.params.id;
    User.findByPk(id)
      .then((data) => {
        if (data) {
          let userData = {
            id: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name
          }
          res.status(200).json(userData);
        } else {
          throw { name: "ResourceNotFound" };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    User.findOne({
      where: { email },
    })
      .then((data) => {
        if (!data) {
          throw { name: "invalidEmailPassword" };
        }
        const match = checkPassword(password, data.password);
        if (match) {
          const payload = {
            id: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
          };
          const access_token = generateToken(payload);
          res.status(200).json({ access_token, payload });
        } else {
          throw { name: "invalidEmailPassword" };
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static register(req, res, next) {
    let data = req.body;
    const newUser = {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
    };
    User.create(newUser)
      .then((data) => {
        sendEmail(data.email)
        res.status(201).json({
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static update(req, res, next) {
    let id = +req.params.id;
    const obj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    User.update(obj, {
      where: {
        id,
      },
      returning: true,
    })
      .then((data) => {
        res.status(200).json(data[1]);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = authController;
