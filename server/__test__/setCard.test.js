const req = require("supertest");
const app = require("../app");
const { cleanUser } = require("./helper/cleanDb");
const { seederUser } = require("./helper/seeder");
const { generateToken } = require("../helpers/jwt");
const { User, SetCard } = require("../models/index");

let access_token = "";
let id = "";
let set_card_id = "";
let query = "";

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
      query = data.title;
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
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("category");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("user_id");
        expect(typeof res.body[0].category).toEqual("string");
        expect(typeof res.body[0].title).toEqual("string");
        expect(typeof res.body[0].user_id).toEqual("number");
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", "")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard`)
      .set("access_token", "asdsasad.r32refe.awefs")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
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
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("category");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("user_id");
        expect(typeof res.body[0].category).toEqual("string");
        expect(typeof res.body[0].title).toEqual("string");
        expect(typeof res.body[0].user_id).toEqual("number");
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard/${query}`)
      .set("access_token", "")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    //execute
    req(app)
      .get(`/setcard/${query}`)
      .set("access_token", "asdsasad.r32refe.awefs")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
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
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("category");
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("user_id");
        expect(typeof res.body.category).toEqual("string");
        expect(typeof res.body.title).toEqual("string");
        expect(typeof res.body.user_id).toEqual("number");
        done();
      });
  });
});

describe("PUT /setcard", function () {
  //valid
  it("Put set card should send response 200 status code", function (done) {
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
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("category");
        expect(res.body[0]).toHaveProperty("title");
        expect(res.body[0]).toHaveProperty("user_id");
        expect(typeof res.body[0].category).toEqual("string");
        expect(typeof res.body[0].title).toEqual("string");
        expect(typeof res.body[0].user_id).toEqual("number");
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
        expect(res.body).toHaveProperty("name");
        expect(typeof res.body.name).toEqual("string");
        done();
      });
  });

  it("No access_token (401)", function (done) {
    //execute
    req(app)
      .delete(`/setcard/${set_card_id}`)
      .set("access_token", "")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });

  it("Incorrect access_token (401)", function (done) {
    //execute
    req(app)
      .delete(`/setcard/${set_card_id}`)
      .set("access_token", "asdsasad.r32refe.awefs")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });
});
