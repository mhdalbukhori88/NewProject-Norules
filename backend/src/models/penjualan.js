const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "penjualan",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    toko_id: { type: DataTypes.INTEGER, allowNull: false },
    produk_id: { type: DataTypes.INTEGER, allowNull: false },
    jumlah_terjual: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    tanggal: { type: DataTypes.DATEONLY, allowNull: false },
    total_harga: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
  },
  { tableName: "penjualan" }
);
