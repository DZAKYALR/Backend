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
      FlipCard.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
    }
  };
  FlipCard.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "user id is required"
        },
        notEmpty: {
          args: true,
          msg: 'user id is required'
        }
      }
    },
    hint: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "hint is required"
        },
        notEmpty: {
          args: true,
          msg: 'hint is required'
        }
      }
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "answer is required"
        },
        notEmpty: {
          args: true,
          msg: 'answer is required'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "category is required"
        },
        notEmpty: {
          args: true,
          msg: 'category is required'
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "type is required"
        },
        notEmpty: {
          args: true,
          msg: 'type is required'
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "title is required"
        },
        notEmpty: {
          args: true,
          msg: 'title is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'FlipCard',
  });
  return FlipCard;
};