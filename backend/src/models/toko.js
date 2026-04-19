const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "toko",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nama_toko: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    lokasi: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true } },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "toko" }
);
