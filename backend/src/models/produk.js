const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "produk",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nama_produk: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    harga: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "produk" }
);
