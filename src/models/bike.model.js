'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bike.init({
    bike_id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey:true,
      allowNull:true,
    },
    user_id: DataTypes.UUID,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    year: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    category: {
      type: DataTypes.ENUM,
      values: ['sports', 'cruiser', 'electric']
    },
    status: {
      type: DataTypes.ENUM,
      values: ['available', 'sold']
    },
    description: DataTypes.STRING,
    bike_image: DataTypes.STRING
  }, {
    timestamps:true,
    sequelize,
    modelName: 'Bike',
    tableName:'bike'
  });
  return Bike;
};