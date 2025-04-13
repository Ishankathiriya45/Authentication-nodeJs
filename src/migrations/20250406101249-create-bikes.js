'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bike', {
      bike_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID
      },
      brand: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      category: {
        type: Sequelize.ENUM,
        values: ['sports', 'cruiser', 'electric']
      },
      status: {
        type: Sequelize.ENUM,
        values: ['available', 'sold']
      },
      description: {
        type: Sequelize.STRING
      },
      bike_image: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bike');
  }
};