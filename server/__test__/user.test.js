const req = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const { User, SetCard } = require("../models/index");

let access_token = "";
let id = "";
let set_card_id = "";
let query = "";

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
  const body = {
    first_name: "some2",
    last_name: "on2e",
    email: "a@gmai2l.com",
    password: "1234562",
  };
    return User.create(body);
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




describe("POST /register", function () {
  //duplicate email
  it("Duplicate email should send response 400 status code", function (done) {
    //setup
    const body = {
      first_name: "some",
      last_name: "one",
      email: "a@gmail.com",
      password: "1234567",
    };
    //execute
    req(app)
      .post("/register")
      .send(body)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["Email already registered"])
        );
        done();
      });
  });

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
          expect.arrayContaining([
            "invalid email format",
            "please fill the email",
          ])
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
          expect.arrayContaining([
            "Password must be greater than 6",
            "please fill the password",
          ])
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
          expect.arrayContaining([
            "Password must be greater than 6",
            "invalid email format",
            "please fill the email",
            "please fill the password",
            "first name cannot be empty",
          ])
        );
        done();
      });
  });
});

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
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["invalidEmailPassword"])
        );
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
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["invalidEmailPassword"])
        );
        done();
      });
  });

  //empty email
  it("empty email should send response 401 status code", function (done) {
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
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["invalidEmailPassword"])
        );
        done();
      });
  });

  //empty password
  it("empty password should send response 401 status code", function (done) {
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
        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["invalidEmailPassword"])
        );
        done();
      });
  });

  it("unregister email should send response 401 status code", function (done) {
    //setup
    const body = {
      email: "zqqqqqqqqq@gmail.com",
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
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["invalidEmailPassword"])
        );
        done();
      });
  });
});

describe("GET /user/:id", function () {
  //valid
  it("should send response 200 status code", function (done) {
    //execute
    req(app)
      .get(`/user/${id}`)
      // .set('access_token', access_token)
      .end(function (err, res) {
        if (err) done(err);
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
      .get(`/user/0`)
      // .set('access_token', access_token)
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(404);
        expect(res.body.errors).toEqual(
          expect.arrayContaining(["ResourceNotFound"])
        );
        done();
      });
  });

  describe("PUT /user/:id", function () {
    //valid
    it("valid update should send response 201 status code", function (done) {
      //setup
      const body = {
        first_name: "some",
        last_name: "one",
      };
      //execute
      req(app)
        .put(`/user/${id}`)
        .send(body)
        .set("access_token", access_token)
        .end(function (err, res) {
          if (err) done(err);
          //assert
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          done();
        });
    });

    it("invalid update user id should send response 500 status code", function (done) {
      //setup
      const body = {
        first_name: "some",
        last_name: "one",
      };
      //execute
      req(app)
        .put(`/user/999`)
        .send(body)
        .set("access_token", access_token)
        .end(function (err, res) {
          if (err) done(err);
          //assert
          expect(res.statusCode).toEqual(500);
          expect(typeof res.body).toEqual("object");
          done();
        });
    });

    // first_name empty
    it("first_name empty should send response 400 status code", function (done) {
      //setup
      const body = {
        first_name: "",
        last_name: "one",
      };
      //execute
      req(app)
        .put(`/user/${id}`)
        .send(body)
        .set("access_token", access_token)
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
  
   
    //all empty
    it("empty value should send response 400 status code", function (done) {
      //setup
      const body = {
        first_name: "",
        last_name: "",
      };
      //execute
      req(app)
        .put(`/user/${id}`)
        .send(body)
        .set("access_token", access_token)
        .end(function (err, res) {
          if (err) done(err);
  
          //assert
          expect(res.statusCode).toEqual(400);
          expect(typeof res.body).toEqual("object");
          expect(res.body.errors).toEqual(
            expect.arrayContaining([
              "first name cannot be empty",
            ])
          );
          done();
        });
    });
  });

});
