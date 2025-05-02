'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Otp.init({
    otp_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: DataTypes.STRING,
    otp: DataTypes.INTEGER
  }, {
    timestamps: true,
    sequelize,
    modelName: 'Otp',
    tableName: 'otp',
  });
  return Otp;
};