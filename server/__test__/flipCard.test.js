const req = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User, SetCard, FlipCard } = require("../models/index");

let access_token = "";
let access_token2 = "";
let id = "";
let id2 = ''
let set_card_id = "";
let card_id = "";

function seederUser(done) {
  const body = {
    first_name: "some",
    last_name: "one",
    email: "a@gmail.com",
    password: "123456",
  };
    return User.create(body);
}
function seederUser2(done) {
  const romeo = {
    first_name: "some2",
    last_name: "on2e",
    email: "a@gmai2l.com",
    password: "1234562",
  };
    return User.create(romeo);
}

afterAll((done) => {
  User.destroy({ where: {} })
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

beforeAll((done) => {
  seederUser2()
  .then(() => {
    return User.findByPk(2);
  })
  .then((data) => {
    let user = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    };
    access_token2 = generateToken(user);
    id2 = +data.id;})
  .catch(err => {
    console.log(err)
  })
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
        expect(typeof res.body[0]).toEqual("object");
        expect(res.body[0]).toHaveProperty("hint");
        expect(res.body[0]).toHaveProperty("answer");
        expect(res.body[0]).toHaveProperty("type");
        expect(res.body[0]).toHaveProperty("set_card_id");
        expect(typeof res.body[0].hint).toEqual("string");
        expect(typeof res.body[0].answer).toEqual("string");
        expect(typeof res.body[0].type).toEqual("string");
        expect(typeof res.body[0].set_card_id).toEqual("number");
        done();
      });
  });

  it("Find card by set card id should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/cards/undefined`)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(500);
        done();
      });
  });


});

describe("PUT /cards/:set_card_id", function () {
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

  it("Put set cards by card id should send response 401 status code ", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "image",
    };
    //execute
    req(app)
      .put(`/cards/9999`)
      .send(body)
      .set("access_token", access_token2)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        done();
      });
  });

  it("Put set cards by wrong card id should send response 500 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "image",
      set_card_id: 9999,
    };
    //execute
    req(app)
      .put(`/cards/9999`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(500);
        done();
      });
  });

  it("Put set cards by card id should send response 200 status code 2", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "image",
      set_card_id: '',
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

  it("Put if hint is empty  set cards by card id should send response 400 status code", function (done) {
    let body = {
      hint: "",
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
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Hint is required !"])
        );
        done();
      });
  });

  it("Put if access_token is wrong set cards by card id should send response 401 status code", function (done) {
    let body = {
      hint: "wdwd",
      answer: "sky",
      type: "image",
      set_card_id: set_card_id,
    };
    //execute
    req(app)
      .put(`/cards/${card_id}`)
      .send(body)
      .set("access_token", 'ggrgrgr')
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["unauthorize"])
        );
        done();
      });
  });

  it("Put if hint is empty  set cards by card id should send response 400 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "",
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
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Answer is required !"])
        );
        done();
      });
  });

  it("Put if type is empty  set cards by card id should send response 400 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "",
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
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Type is required !"])
        );
        done();
      });
  });

  // it("Put set cards by wrong card id should send response 404 status code", function (done) {
  //   let body = {
  //     hint: "something blue",
  //     answer: "sky",
  //     type: "image",
  //     set_card_id: set_card_id,
  //   };
  //   //execute
  //   req(app)
  //     .put(`/cards/0`)
  //     .set("access_token", access_token)
  //     .send(body)
  //     .end(function (err, res) {
  //       if (err) done(err);
  //       //assert
  //       expect(res.statusCode).toEqual(404);
  //       expect(res.body.errors).toEqual(
  //         expect.arrayContaining(["ResourceNotFound"]),
  // );
  //       done();
  //     });
  // },10000);
});

describe("DELETE /cards/:set_card_id", function () {
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
});
describe("POST /cards/:set_card_id", function () {
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

  it("Post if hint is empty  set cards by card id should send response 400 status code", function (done) {
    let body = {
      hint: "",
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
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Hint is required !"])
        );
        done();
      });
  });

  it("Post if hint is empty  set cards by card id should send response 400 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "",
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
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Answer is required !"])
        );
        done();
      });
  });

  it("Post if type is empty  set cards by card id should send response 400 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "",
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
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Type is required !"])
        );
        done();
      });
  });

  it("Post if set card id is empty  set cards by card id should send response 400 status code", function (done) {
    let body = {
      hint: "something blue",
      answer: "sky",
      type: "img",
      set_card_id: "",
    };
    //execute
    req(app)
      .post(`/cards/${set_card_id}`)
      .send(body)
      .set("access_token", access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Set card id is required !"])
        );
        done();
      });
  });
});
