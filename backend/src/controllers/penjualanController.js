const { Op, fn, col } = require("sequelize");
const { Penjualan, Produk, Stok, Toko } = require("../models");
const { ensureProdukExists, ensureTokoExists } = require("../services/referenceService");
const ApiError = require("../utils/ApiError");
const { getJakartaDate } = require("../utils/date");

async function createPenjualan(req, res) {
  const { toko_id, produk_id, jumlah_terjual, tanggal } = req.body;
  await ensureTokoExists(toko_id);
  const produk = await ensureProdukExists(produk_id);

  const stok = await Stok.findOne({ where: { toko_id, produk_id } });
  if (!stok) {
    throw new ApiError(404, "Stok produk untuk toko tersebut belum tersedia");
  }
  if (stok.jumlah_stok < jumlah_terjual) {
    throw new ApiError(400, "Jumlah stok tidak mencukupi untuk transaksi penjualan");
  }

  const penjualan = await Penjualan.create({
    toko_id,
    produk_id,
    jumlah_terjual,
    tanggal,
    total_harga: Number(produk.harga) * Number(jumlah_terjual),
  });

  await stok.update({
    jumlah_stok: stok.jumlah_stok - Number(jumlah_terjual),
    updated_at: new Date(),
  });

  res.status(201).json({ success: true, data: penjualan });
}

async function getPenjualanHariIni(_req, res) {
  const today = getJakartaDate();
  const data = await Penjualan.findAll({
    where: { tanggal: today },
    include: [
      { model: Toko, as: "toko", attributes: ["id", "nama_toko", "lokasi"] },
      { model: Produk, as: "produk", attributes: ["id", "nama_produk", "harga"] },
    ],
    order: [["id", "ASC"]],
  });

  res.json({ success: true, data });
}

async function getPenjualanByToko(req, res) {
  const toko = await ensureTokoExists(req.params.id);
  const data = await Penjualan.findAll({
    where: { toko_id: toko.id },
    include: [
      { model: Toko, as: "toko", attributes: ["id", "nama_toko", "lokasi"] },
      { model: Produk, as: "produk", attributes: ["id", "nama_produk", "harga"] },
    ],
    order: [["tanggal", "DESC"], ["id", "DESC"]],
  });

  res.json({ success: true, data });
}

async function getLaporanPenjualan(req, res) {
  const { tanggal_mulai, tanggal_akhir } = req.query;
  const where = {};

  if (tanggal_mulai && tanggal_akhir) {
    where.tanggal = { [Op.between]: [tanggal_mulai, tanggal_akhir] };
  }

  const data = await Penjualan.findAll({
    attributes: [
      "toko_id",
      "tanggal",
      [fn("SUM", col("jumlah_terjual")), "total_item_terjual"],
      [fn("SUM", col("total_harga")), "total_penjualan"],
    ],
    where,
    include: [{ model: Toko, as: "toko", attributes: ["id", "nama_toko", "lokasi"] }],
    group: ["toko_id", "tanggal", "toko.id"],
    order: [["tanggal", "DESC"]],
  });

  res.json({ success: true, data });
}

module.exports = {
  createPenjualan,
  getPenjualanHariIni,
  getPenjualanByToko,
  getLaporanPenjualan,
};
