'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FlipCards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      set_card_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'SetCards',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      hint: {
        allowNull: false,
        type: Sequelize.STRING
      },
      answer: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FlipCards');
  }
};