const req = require("supertest");
const app = require("../app");
const { cleanUser } = require("./helper/cleanDb");
const { seederUser } = require("./helper/seeder");
const { generateToken } = require("../helpers/jwt");
const { User, SetCard } = require("../models/index");

let access_token = "";
let id = "";
let set_card_id = "";
let query = "img";

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
        first_name: data.first_name,
        last_name: data.last_name,
      };
      access_token = generateToken(user);
      id = +data.id;
      return SetCard.create({
        category: "Animals",
        title: "img",
        user_id: id,
      });
    })
    .then((data) => {
      set_card_id = data.id;
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("GET /setcard", function () {
  //valid
  it("Find set card should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        done();
      });
  });
});

describe("GET /setcard/:query", function () {
  //valid
  it("Find set card should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/setcard/${query}`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        done();
      });
  });
});

describe("POST /setcard", function () {
  //valid
  it("Post set card should send response 201 status code", function (done) {
    //setup
    const body = {
      category: "Animals",
      title: "img",
      user_id: id,
    };
    //execute
    req(app)
      .post(`/setcard`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(201);
        done();
      });
  });
});

describe("PUT /setcard", function () {
  //valid
  it("Find set card should send response 200 status code", function (done) {
    //setup
    const body = {
      category: "Animals2",
      title: "img2",
      user_id: id,
    };
    //execute
    req(app)
      .put(`/setcard/${set_card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        done();
      });
  });
});

describe("DELETE /setcard/:id", function () {
  //valid
  it("Delete set card should send response 200 status code", function (done) {
    //setup
    //execute
    req(app)
      .delete(`/setcard/${set_card_id}`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        done();
      });
  });
});
