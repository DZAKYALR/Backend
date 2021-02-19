const req = require("supertest");
const app = require("../app");
const { cleanUser, seederUser } = require("./helper/cleanDb");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");

let id = "";

afterAll((done) => {
  cleanUser()
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

beforeAll(function (done) {
  User.create({
    email: "admin1@mail.com",
    password: "12345678",
    first_name: "some",
    last_name: "one",
  });
});
