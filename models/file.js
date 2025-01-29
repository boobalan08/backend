const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const File = sequelize.define(
  "File",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "processing", "failed"),
      defaultValue: "pending",
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    tableName: "Files",
    timestamps: true,
  }
);

module.exports = File;
