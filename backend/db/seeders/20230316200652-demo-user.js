'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'User'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName:'Fake',
        lastName: 'User'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Another',
        lastName: 'Fake'
      },
      {
        email: 'user33@user.io',
        username: 'FakeUser33',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: 'Mark',
        lastName: 'Bean'
      },
      {
        email: 'user44@user.io',
        username: 'FakeUser44',
        hashedPassword: bcrypt.hashSync('password5'),
        firstName: 'Jay',
        lastName: 'Luna'
      },
      {
        email: 'user55@user.io',
        username: 'FakeUser55',
        hashedPassword: bcrypt.hashSync('password6'),
        firstName: 'Adonis',
        lastName: 'Echenique'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser33', 'FakeUser44', 'FakeUser55'] }
    }, {});
  }
};
