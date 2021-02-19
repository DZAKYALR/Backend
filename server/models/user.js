"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.SetCard, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            args: true,
            msg: "invalid email format",
          },
          notEmpty: {
            args: true,
            msg: "please fill the email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "please fill the password",
          },
          valid(value) {
            if (!value || value <= 6) {
              throw new Error("Password must be greater than 6");
            }
          },
        },
      },
      first_name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "first name cannot be empty",
          },
        },
      },
      last_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user, options) {
          user.password = hashPassword(user.password);
        },
      },
    }
  );
  return User;
};
