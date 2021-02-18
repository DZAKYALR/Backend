'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FlipCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FlipCard.init({
    user_id: DataTypes.INTEGER,
    hint: DataTypes.STRING,
    answer: DataTypes.STRING,
    category: DataTypes.STRING,
    type: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FlipCard',
  });
  return FlipCard;
};