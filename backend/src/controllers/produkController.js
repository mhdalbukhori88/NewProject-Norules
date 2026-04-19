const { Produk } = require("../models");
const ApiError = require("../utils/ApiError");

async function createProduk(req, res) {
  const produk = await Produk.create(req.body);
  res.status(201).json({ success: true, data: produk });
}

async function getProduk(_req, res) {
  const produk = await Produk.findAll({ order: [["id", "ASC"]] });
  res.json({ success: true, data: produk });
}

async function updateProduk(req, res) {
  const produk = await Produk.findByPk(req.params.id);
  if (!produk) {
    throw new ApiError(404, "Produk tidak ditemukan");
  }
  await produk.update(req.body);
  res.json({ success: true, data: produk });
}

async function deleteProduk(req, res) {
  const produk = await Produk.findByPk(req.params.id);
  if (!produk) {
    throw new ApiError(404, "Produk tidak ditemukan");
  }
  await produk.destroy();
  res.json({ success: true, message: "Produk berhasil dihapus" });
}

module.exports = { createProduk, getProduk, updateProduk, deleteProduk };
