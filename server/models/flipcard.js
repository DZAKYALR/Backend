"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FlipCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FlipCard.belongsTo(models.SetCard, {
        foreignKey: "set_card_id",
      });
    }
  }
  FlipCard.init(
    {
      set_card_id: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            args: true,
            msg: "Set card id is required !",
          },
        },
      },
      hint: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Hint is required !",
          },
        },
      },
      answer: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Answer is required !",
          },
        },
      },
      type: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Type is required !",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "FlipCard",
    }
  );
  return FlipCard;
};
