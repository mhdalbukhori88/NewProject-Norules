const { Produk, Stok, Toko } = require("../models");
const { ensureProdukExists, ensureTokoExists } = require("../services/referenceService");
const ApiError = require("../utils/ApiError");

async function createStok(req, res) {
  const { toko_id, produk_id, jumlah_stok } = req.body;
  await ensureTokoExists(toko_id);
  await ensureProdukExists(produk_id);

  const existingStok = await Stok.findOne({ where: { toko_id, produk_id } });
  if (existingStok) {
    throw new ApiError(409, "Stok untuk toko dan produk tersebut sudah ada");
  }

  const stok = await Stok.create({
    toko_id,
    produk_id,
    jumlah_stok,
    updated_at: new Date(),
  });

  res.status(201).json({ success: true, data: stok });
}

async function getStok(_req, res) {
  const stok = await Stok.findAll({
    include: [
      { model: Toko, as: "toko", attributes: ["id", "nama_toko", "lokasi"] },
      { model: Produk, as: "produk", attributes: ["id", "nama_produk", "harga"] },
    ],
    order: [["id", "ASC"]],
  });

  res.json({ success: true, data: stok });
}

async function updateStok(req, res) {
  const stok = await Stok.findByPk(req.params.id);
  if (!stok) {
    throw new ApiError(404, "Data stok tidak ditemukan");
  }

  const payload = { ...req.body, updated_at: new Date() };
  if (payload.toko_id) {
    await ensureTokoExists(payload.toko_id);
  }
  if (payload.produk_id) {
    await ensureProdukExists(payload.produk_id);
  }

  await stok.update(payload);
  res.json({ success: true, data: stok });
}

async function deleteStok(req, res) {
  const stok = await Stok.findByPk(req.params.id);
  if (!stok) {
    throw new ApiError(404, "Data stok tidak ditemukan");
  }
  await stok.destroy();
  res.json({ success: true, message: "Data stok berhasil dihapus" });
}

module.exports = { createStok, getStok, updateStok, deleteStok };
