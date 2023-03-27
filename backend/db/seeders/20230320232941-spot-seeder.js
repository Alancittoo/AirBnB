'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: '1',
        address: '911 Shorty Ave',
        city: 'Oceanside',
        state: 'California',
        country: 'United States',
        lat: 50.0273,
        lng: -120.0680,
        name: 'Sean Kingstons Dome',
        description: 'Fire Burnin, Fire Burnin, On the Dance Floor',
        price: 120
      },
      {
        ownerId: '2',
        address: '420 Puff Street',
        city: 'San Diego',
        state: 'California',
        country: 'United States',
        lat: 420.3163,
        lng: -72.9223,
        name: 'HotBox',
        description: 'Welcome to Cloud 9',
        price: 420
      },
      {
        ownerId: '2',
        address: '125 Summoners Rift Ave',
        city: 'League of Legends',
        state: 'Rhode Island',
        country: 'United States',
        lat: 35.9741,
        lng: 19.3900,
        name: 'Nerds Lair',
        description: 'Nerds Only, No Girls Allowed',
        price: 70
      },
      {
        ownerId: '4',
        address: '875 Ackermann Road',
        city: 'Titan',
        state: 'Florida',
        country: 'United States',
        lat: -21.5240,
        lng: 56.0253,
        name: 'Levis Place ',
        description: 'Attack On Titan Homes',
        price: 250
      },
      {
        ownerId: '2',
        address: '128 Kirby Circle',
        city: 'Kirby City',
        state: 'Ohio',
        country: 'United States',
        lat: 238.8723,
        lng: -45.1231,
        name: 'Pink Dude House',
        description: 'Nice and Pink',
        price: 250
      },
      {
        ownerId: '3',
        address: '324 Deadpool Street',
        city: 'Wade',
        state: 'New York',
        country: 'United States',
        lat: 215.4831,
        lng: 29.9384,
        name: 'Deadpool Mansion',
        description: 'Big and Reckless place',
        price: 505
      },
      {
        ownerId: '4',
        address: 'Sukuna Road',
        city: 'Itadori',
        state: 'Oklahoma',
        country: 'United States',
        lat: 65.3901,
        lng: -239.8431,
        name: 'Cursed',
        description: 'Cursed home',
        price: 1000
      },
      {
        ownerId: '2',
        address: 'Inosuke Boulevard',
        city: 'Demon City',
        state: 'Georgia',
        country: 'United States',
        lat: -90.8123,
        lng: -27.2781,
        name: 'Boar House',
        description: 'Crazy Boar Home to other, but still cool',
        price: 320
      },
      {
        ownerId: '1',
        address: 'Jiriya Toad Road',
        city: 'Hidden Leaf',
        state: 'Texas',
        country: 'United States',
        lat: 73.6741,
        lng: 82.0231,
        name: 'Big Toad',
        description: 'Tiny Toad on the Inside, but Giant Toad on the Inside',
        price: 810
      },
      {
        ownerId: '2',
        address: 'Killua',
        city: 'Lightning Strike',
        state: 'Nebraska',
        country: 'United States',
        lat: 11.5531,
        lng: 41.0992,
        name: 'Fast House',
        description: 'Lightning House of Killua and stuff like that',
        price: 15
      },
      {
        ownerId: '3',
        address: '424 Strip Avenue',
        city: 'Las Vegas',
        state: 'Nevada',
        country: 'United States',
        lat: 38.2341,
        lng: -29.4321,
        name: 'Omega Mart',
        description: 'The Famous and Landmark in Area 15',
        price: 840
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, '');
  }
};
