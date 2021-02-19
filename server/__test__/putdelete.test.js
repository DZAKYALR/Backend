const req = require("supertest");
const app = require("../app");
const { cleanUser } = require("./helper/cleanDb");
const { seederUser } = require("./helper/seeder");
const { generateToken } = require('../helpers/jwt');
const { User, FlipCard  } = require("../models/index");

let access_token = ''
let id = ''
let card_id = ''

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
      access_token = generateToken(user)
      id = +data.id
      return FlipCard.create({
        hint: 'string',
        answer: 'string',
        category: 'string',
        type: 'string',
        title: 'string',
        user_id: id
      })
    })
    .then(data => {
      console.log(data, '<<<data card')
      card_id = +data.id
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("PUT /cards/:id", function () {
  //valid
  it("should send response 200 status code", function (done) {
    const body = {
      hint: 'string',
      answer: 'string',
      category: 'string',
      type: 'string',
      title: 'string',
      user_id: id
    };
    //execute
    req(app)
      .put(`/cards/${card_id}`)
      .set('access_token', access_token)
      .send(body)
      .end(function (err, res) {
        if (err) done(err);
        console.log(res.statusCode);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("object");
        done();
      });
  });

  it("No Input fields (400)", function (done) {
    const body = {
      hint: '',
      answer: '',
      category: '',
      type: '',
      title: '',
      user_id: id
    };
    //execute
    req(app)
      .put(`/cards/${card_id}`)
      .set('access_token', access_token)
      .send(body)
      .end(function (err, res) {
        if (err) done(err);
        console.log(res.statusCode);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["hint is required", "answer is required", "category is required", "type is required", "title is required"])
        )
        done();
      });
  });

  it("No access_token (401)", function (done) {
    const body = {
      hint: 'string',
      answer: 'string',
      category: 'string',
      type: 'string',
      title: 'string',
      user_id: id
    };
    //execute
    req(app)
      .put(`/cards/${card_id}`)
      .set('access_token', "")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(['unauthorize'])
        )
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    const body = {
      hint: 'string',
      answer: 'string',
      category: 'string',
      type: 'string',
      title: 'string',
      user_id: id
    };
    //execute
    req(app)
      .put(`/cards/${card_id}`)
      .set('access_token', "asdsasad.r32refe.awefs")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(['unauthorize'])
        )
        done();
      });
  });
});

describe("DELETE /cards/:id", function () {
  //valid
  it("should send response 200 status code", function (done) {
    //execute
    req(app)
      .delete(`/cards/${card_id}`)
      .set('access_token', access_token)
      .end(function (err, res) {
        if (err) done(err);
        console.log(res.statusCode);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("object");
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //execute
    req(app)
      .delete(`/cards/${card_id}`)
      .set('access_token', "")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(['unauthorize'])
        )
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    //execute
    req(app)
      .delete(`/cards/${card_id}`)
      .set('access_token', "asdsasad.r32refe.awefs")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(['unauthorize'])
        )
        done();
      });
  });
});
