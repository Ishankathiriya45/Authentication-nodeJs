"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "role",
      [
        {
          role_id: Sequelize.literal("UUID()"),
          role: "Admin",
        },
        {
          role_id: Sequelize.literal("UUID()"),
          role: "Buyer",
        },
        {
          role_id: Sequelize.literal("UUID()"),
          role: "Seller",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
