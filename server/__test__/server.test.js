const req = require("supertest");
const app = require("../app");


describe("GET /", function () {
  //duplicate email
  it("Should return welcome and status 200", function (done) {
    //setup
    //execute
    req(app)
      .get("/")
      .end(function (err, res) {
        if (err) done(err);
        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("object");
        done();
      });
  });

});
