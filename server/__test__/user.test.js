const req = require("supertest");
const app = require("../app");
const { cleanUser } = require("./helper/cleanDb");

// beforeAll((done) => {});

afterAll((done) => {
  cleanUser()
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("POST /register", function () {
  //valid
  it("valid register should send response 201 status code", function (done) {
    //setup
    const body = {
      first_name: "some",
      last_name: "one",
      email: "my_email@gmail.com",
      password: "1234567",
    };
    //execute
    req(app)
      .post("/register")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);
        console.log(res.statusCode);
        //assert
        expect(res.statusCode).toEqual(201);
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

  // first_name empty
  it("first_name empty should send response 400 status code", function (done) {
    //setup
    const body = {
      first_name: "",
      last_name: "one",
      email: "a@gmail.com",
      password: "123456",
    };
    //execute
    req(app)
      .post("/register")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["first name cannot be empty"])
        );
        done();
      });
  });

  //last_name empty
  // it("last_name empty should send response 400 status code", function (done) {
  //   //setup
  //   const body = {
  //     first_name: "some",
  //     last_name: "",
  //     email: "a@gmail.com",
  //     password: "123456",
  //   };
  //   //execute
  //   req(app)
  //     .post("/register")
  //     .send(body)
  //     .end(function (err, res) {
  //       if (err) done(err);

  //       //assert
  //       expect(res.statusCode).toEqual(400);
  //       expect(typeof res.body).toEqual("object");
  //       expect(res.body.errors).toEqual(
  //         expect.arrayContaining(["invalid email format", "please fill the email"])
  //       );
  //       done();
  //     });
  // });

  //email empty
  it("email empty should send response 400 status code", function (done) {
    //setup
    const body = {
      first_name: "some",
      last_name: "one",
      email: "",
      password: "123456",
    };
    //execute
    req(app)
      .post("/register")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["invalid email format", "please fill the email"])
        );
        done();
      });
  });

  //password empty
  it("password empty should send response 400 status code", function (done) {
    //setup
    const body = {
      first_name: "some",
      last_name: "one",
      email: "a@gmail.com",
      password: "",
    };
    //execute
    req(app)
      .post("/register")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Password must be greater than 6", "please fill the password"])
        );
        done();
      });
  });

  //invalid email format
  it("invalid email format should send response 400 status code", function (done) {
    //setup
    const body = {
      first_name: "some",
      last_name: "one",
      email: "abcd",
      password: "123456",
    };
    //execute
    req(app)
      .post("/register")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["invalid email format"])
        );
        done();
      });
  });

  //all empty
  it("empty value should send response 400 status code", function (done) {
    //setup
    const body = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    };
    //execute
    req(app)
      .post("/register")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);

        //assert
        expect(res.statusCode).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Password must be greater than 6", "invalid email format", "please fill the email", "please fill the password", "first name cannot be empty"])
        );
        done();
      });
  });
});
