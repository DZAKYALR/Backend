const req = require("supertest");
const app = require("../app");
const { cleanUser } = require("./helper/cleanDb");
const { seederUser } = require("./helper/seeder");
const { User } = require("../models/index");
const { generateToken } = require("../helpers/jwt");

let accesstoken = "";

afterAll((done) => {
  cleanUser()
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});
beforeAll((done) => {
  seederUser()
    .then(() => {
      return User.findOne();
    })
    .then((data) => {
      let user = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

// //valid
