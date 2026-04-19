const { Produk, Toko } = require("../models");
const ApiError = require("../utils/ApiError");

async function ensureTokoExists(tokoId) {
  const toko = await Toko.findByPk(tokoId);
  if (!toko) {
    throw new ApiError(404, `Toko dengan id ${tokoId} tidak ditemukan`);
  }
  return toko;
}

async function ensureProdukExists(produkId) {
  const produk = await Produk.findByPk(produkId);
  if (!produk) {
    throw new ApiError(404, `Produk dengan id ${produkId} tidak ditemukan`);
  }
  return produk;
}

module.exports = { ensureTokoExists, ensureProdukExists };
