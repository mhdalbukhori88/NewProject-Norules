const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "stok",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    toko_id: { type: DataTypes.INTEGER, allowNull: false },
    produk_id: { type: DataTypes.INTEGER, allowNull: false },
    jumlah_stok: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "stok" }
);
