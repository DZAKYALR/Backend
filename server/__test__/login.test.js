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
describe("POST /login", function () {
  it("valid login should send response 200 status code", function (done) {
    //setup
    const body = {
      email: "a@gmail.com",
      password: "123456",
    };
    //execute
    req(app)
      .post("/login")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("access_token");
        expect(typeof res.body.access_token).toEqual("string");
        done();
      });
  });

  //invalid password
  it("invalid password should send response 401 status code", function (done) {
    //setup
    const body = {
      email: "a@gmail.com",
      password: "qwerty",
    };
    //execute
    req(app)
      .post("/login")
      .send(body)
      .end(function (err, res) {
        console.log(err);
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Invalid email or password");
        done();
      });
  });

  //invalid email
  it("invalid email should send response 401 status code", function (done) {
    //setup
    const body = {
      email: "z@gmail.com",
      password: "123456",
    };
    //execute
    req(app)
      .post("/login")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Invalid email or password");
        done();
      });
  });

  //empty email
  it("empty email should send response 400 status code", function (done) {
    //setup
    const body = {
      email: "",
      password: "123456",
    };
    //execute
    req(app)
      .post("/login")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Email is required");
        done();
      });
  });

  //empty password
  it("empty password should send response 400 status code", function (done) {
    //setup
    const body = {
      email: "a@gmail.com",
      password: "",
    };
    //execute
    req(app)
      .post("/login")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Password is required");
        done();
      });
  });
});

describe("POST /checktoken", function () {
  //checktoken
  it("valid checktoken should send response 201 status code", function (done) {
    //setup
    //execute
    req(app)
      .post(`/checktoken`)
      .send()
      .set("accesstoken", accesstoken)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("string");
        expect(res.body).toEqual("admin");
        done();
      });
  });
});
