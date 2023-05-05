'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, {foreignKey: 'spotId'})
      Booking.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    spotId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE'
    },
    startDate: {
     type: DataTypes.DATE,
     allowNull: false,
     validate: {
      isDate: true
     }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        checkEndDate(value) {
          if (value < this.startDate) throw new Error("End date must be after start date!");
        },
        }
      }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
