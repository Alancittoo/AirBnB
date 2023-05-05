'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2023-08-01'),
        endDate: new Date('2023-10-10')
      },
      {
        spotId: 3,
        userId: 4,
        startDate: new Date('2023-9-10'),
        endDate: new Date('2023-11-12')
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date('2023-10-03'),
        endDate: new Date('2023-12-12')
      }
    ])

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options, 'Bookings');
  }
};
