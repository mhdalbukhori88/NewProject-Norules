const sequelize = require("../config/database");
const Toko = require("./toko");
const Produk = require("./produk");
const Stok = require("./stok");
const Penjualan = require("./penjualan");

Toko.hasMany(Stok, { foreignKey: "toko_id", as: "stok" });
Produk.hasMany(Stok, { foreignKey: "produk_id", as: "stok" });
Stok.belongsTo(Toko, { foreignKey: "toko_id", as: "toko" });
Stok.belongsTo(Produk, { foreignKey: "produk_id", as: "produk" });

Toko.hasMany(Penjualan, { foreignKey: "toko_id", as: "penjualan" });
Produk.hasMany(Penjualan, { foreignKey: "produk_id", as: "penjualan" });
Penjualan.belongsTo(Toko, { foreignKey: "toko_id", as: "toko" });
Penjualan.belongsTo(Produk, { foreignKey: "produk_id", as: "produk" });

module.exports = { sequelize, Toko, Produk, Stok, Penjualan };
