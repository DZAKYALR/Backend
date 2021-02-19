'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SetCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SetCard.belongsTo(models.User, { 
        foreignKey: "user_id" 
      })
      SetCard.hasMany(models.FlipCard, {
        foreignKey: "set_card_id",
        targetKey: "id",
      });
    }
  };
  SetCard.init({
    title: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SetCard',
  });
  return SetCard;
};