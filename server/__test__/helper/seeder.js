const { User } = require("../../models/index");

function seederUser(done) {
  const body = {
    firs_tname: "some",
    last_name: "one",
    email: "a@gmail.com",
    password: "123456",
  };

  if (process.env.NODE_ENV == "test") {
    return User.create(body);
  }
}

module.exports = { seederUser };
