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
      FlipCard.belongsTo(models.SetCard, { 
        foreignKey: "set_card_id" 
      })
    }
  };
  FlipCard.init({
    set_card_id: DataTypes.INTEGER,
    hint: DataTypes.STRING,
    answer: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FlipCard',
  });
  return FlipCard;
};