const { Toko } = require("../models");
const ApiError = require("../utils/ApiError");

async function createToko(req, res) {
  const toko = await Toko.create(req.body);
  res.status(201).json({ success: true, data: toko });
}

async function getToko(_req, res) {
  const toko = await Toko.findAll({ order: [["id", "ASC"]] });
  res.json({ success: true, data: toko });
}

async function updateToko(req, res) {
  const toko = await Toko.findByPk(req.params.id);
  if (!toko) {
    throw new ApiError(404, "Toko tidak ditemukan");
  }
  await toko.update(req.body);
  res.json({ success: true, data: toko });
}

async function deleteToko(req, res) {
  const toko = await Toko.findByPk(req.params.id);
  if (!toko) {
    throw new ApiError(404, "Toko tidak ditemukan");
  }
  await toko.destroy();
  res.json({ success: true, message: "Toko berhasil dihapus" });
}

module.exports = { createToko, getToko, updateToko, deleteToko };
