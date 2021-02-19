const req = require("supertest");
const app = require("../app");
const { cleanUser, seederUser } = require("./helper/cleanDb");
const { generateToken } = require('../helpers/jwt');
const { User } = require('../models')

let accesstoken = "";
let id = ""

afterAll((done) => {
  cleanUser()
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

beforeAll(function(done) {
  User.create({ email: 'admin1@mail.com', password: '12345678', first_name: "some", last_name: "one" })
  .then(data => {
    accesstoken = generateToken({ email: 'admin1@mail.com', password: '12345678', firs_tname: "some", last_name: "one" })
    id = data.id
    console.log(id, '<<<<<<<<')
    done()
  })
  .catch(err => {
    console.log(err)
    done()
  })
})

describe("GET /user/:id", function () {
  //valid
  it("should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/user/${id}`)
      // .set('access_token', accesstoken)
      .end(function (err, res) {
        if (err) done(err);
        console.log(res.statusCode);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("first_name");
        expect(res.body).toHaveProperty("last_name");
        expect(typeof res.body.id).toEqual("number");
        expect(typeof res.body.first_name).toEqual("string");
        expect(typeof res.body.last_name).toEqual("string");
        expect(typeof res.body.email).toEqual("string");
        done();
      });
  });
  it("should send response 404 status code not found data", function (done) {
    //execute
    req(app)
      .get(`/user/1`)
      // .set('access_token', accesstoken)
      .end(function (err, res) {
        if (err) done(err);
        console.log(res.statusCode);
        //assert
        expect(res.statusCode).toEqual(404);
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["ResourceNotFound"])
        )
        done()
      });
  });
});
