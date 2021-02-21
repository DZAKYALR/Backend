const env = process.env.NODE_ENV || "development";

if (env == "development" || env == "test") {
  require("dotenv").config();
}

module.exports = {
  development: {
    username: "postgres",
    password: "root",
    database: "flip_card",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "root",
    database: "flip_card_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialectOptions":{
      "ssl": {
        "rejectUnauthorized": false
      }
    }
  }
};
