"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "joh.doe@gmail.com",
          password: "secret",
          gender: "male",
        },
        {
          firstName: "John",
          lastName: "Lopez",
          email: "joh.doe1@gmail.com",
          password: "secret1",
          gender: "male",
        },
        {
          firstName: "John",
          lastName: "Perez",
          email: "joh.doe2@gmail.com",
          password: "secret2",
          gender: "male",
        },
        {
          firstName: "John",
          lastName: "Ramirez",
          email: "joh.doe3@gmail.com",
          password: "secret3",
          gender: "male",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Users", null, {});
  },
};
