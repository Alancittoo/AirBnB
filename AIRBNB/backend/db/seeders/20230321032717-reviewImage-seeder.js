'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://miro.medium.com/v2/0*ZjYSm_q36J4KChdn'
      },
      {
        reviewId: 2,
        url: 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/kirby-and-the-forgotten-land/4/43/Photo_Screenshot_2022-04-03_22-41-41.png?width=814'
      },
      {
        reviewId: 3,
        url: 'https://images.bauerhosting.com/legacy/media/60ed/c7d4/2b16/787a/60ed/a9f0/MicrosoftTeams-image.png?q=80&auto=format&w=1800&ar=16:9&fit=crop&crop=top'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options);
  }
};
