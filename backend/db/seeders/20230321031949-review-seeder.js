'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 5,
        review: 'Pretty nice, 4 stars',
        stars: 4,
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Amazing, Gets a 5 star from me',
        stars: 5,
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Bleh terrible, 2 stars',
        stars: 2,
      },
      {
        spotId: 4,
        userId: 2,
        review: 'Above average mid, 4 stars',
        stars: 4,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options);
  }
};
