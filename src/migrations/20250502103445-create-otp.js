"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("otp", {
      otp_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
      },
      otp: {
        type: Sequelize.INTEGER,
      },
      otp_send_date: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("otp");
  },
};
