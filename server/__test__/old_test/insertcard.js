const req = require("supertest");
const app = require("../app");
const { cleanUser } = require("./helper/cleanDb");
const { seederUser } = require("./helper/seeder");
const { generateToken } = require('../helpers/jwt');
const { User } = require("../models/index");

let access_token = ''
let id = ''

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
      // console.log(data, "masuk")
      let user = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      };
      // console.log(user, "masuk")
      access_token = generateToken(user)
      id = +data.id
      // console.log(access_token, "masuk")
      // console.log(id, "masuk")
      
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("POST /cards", function () {
  //valid
  it("insert should send response 201 status code", function (done) {
    //setup
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
      .post("/cards")
      .send(body)
      .set('access_token', access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(201);
        expect(typeof res.body).toEqual("object");
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //setup
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
      .post("/cards")
      .send(body)
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
    //setup
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
      .post("/cards")
      .send(body)
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

  it("No Input fields (400)", function (done) {
    //setup
    const body = {
      hint: '',
      answer: '',
      category: '',
      type: '',
      title: '',
      user_id: ''
    };
    //execute
    req(app)
      .post("/cards")
      .send(body)
      .set('access_token', access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["hint is required", "answer is required", "category is required", "type is required", "title is required"])
        )
        done();
      });
  });
})

describe("GET /cards/", function () {
  //valid
  it("should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/cards/`)
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
      .get("/cards")
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
      .get("/cards")
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
