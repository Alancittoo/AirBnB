'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://cdn.booooooom.com/wp-content/uploads/2020/03/ourhouseisonfire-icyandsot-3.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i2-prod.dailystar.co.uk/incoming/article26539871.ece/ALTERNATES/s615b/0_GettyImages-530723780.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://esports.inquirer.net/files/2022/12/League-and-TFT-Transition-Illustration-4-1-1024x576.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://heyitszel.files.wordpress.com/2018/08/attack-on-titan_ep1_jaeger-home1.png?w=700',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://preview.redd.it/6yh3vokbi8561.png?width=960&crop=smart&auto=webp&v=enabled&s=047e52c556862bf63a1fc5ef0a403d83f4288b6b',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://i0.wp.com/www.heyuguys.com/images/2017/06/Deadpool-2.jpg?w=1200&ssl=1',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://hips.hearstapps.com/hmg-prod/images/abandoned-haunted-house-refuge-of-spirits-moonlit-royalty-free-image-1633983690.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/a/a0/Tsuzumi_Mansion_Arc_anime.png/revision/latest/scale-to-width-down/350?cb=20190615170944',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://static.wikia.nocookie.net/naruto/images/a/aa/Summoning_Toad_Shop_Technique.png/revision/latest/scale-to-width-down/350?cb=20151226130733',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://static.wikia.nocookie.net/hunterxhunter/images/a/a8/Testing_gato.png/revision/latest/scale-to-width-down/350?cb=20120311122439',
        preview: true
      },
      {
        spotId: 11,
        url: 'https://assets-global.website-files.com/5dad7a19f43e6f31a9e92718/5f5a71323cfcbf714357842a_OM_facade_v2.jpg',
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};
