"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResetToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResetToken.init(
    {
      reset_token_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      timestamps: true,
      sequelize,
      modelName: "ResetToken",
      tableName: "resettoken",
    }
  );
  return ResetToken;
};
