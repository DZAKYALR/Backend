const req = require("supertest");
const app = require("../app");
const { cleanUser } = require("./helper/cleanDb");
const { seederUser } = require("./helper/seeder");
const { generateToken } = require("../helpers/jwt");
const { User, SetCard, FlipCard } = require("../models/index");

let access_token = "";
let id = "";
let set_card_id = "";
let card_id = "";

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

      return FlipCard.create({
        hint: "something blue",
        answer: "sky",
        type: "image",
        set_card_id: set_card_id,
      });
    })
    .then((data) => {
      card_id = data.id;
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("GET /cards/:set_card_id", function () {
  //get by set card id
  it("Find card by set card id should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/cards/${set_card_id}`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        done();
      });
  });

  // get by id
  it("Put set cards by card id should send response 200 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "image",
      set_card_id: set_card_id,
    };
    //execute
    req(app)
      .put(`/cards/${card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        done();
      });
  });

  it("Delete cards by card id should send response 200 status code", function (done) {
    //execute
    req(app)
      .delete(`/cards/${card_id}`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        done();
      });
  });

  // get by id
  it("Post set cards by card id should send response 201 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "image",
      set_card_id: set_card_id,
    };
    //execute
    req(app)
      .post(`/cards/${set_card_id}`)
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
