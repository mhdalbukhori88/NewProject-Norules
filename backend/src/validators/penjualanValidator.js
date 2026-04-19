const { body } = require("express-validator");

const penjualanRules = [
  body("toko_id").isInt({ min: 1 }).withMessage("toko_id harus berupa angka positif"),
  body("produk_id").isInt({ min: 1 }).withMessage("produk_id harus berupa angka positif"),
  body("jumlah_terjual").isInt({ min: 1 }).withMessage("jumlah_terjual minimal 1"),
  body("tanggal").isISO8601().withMessage("tanggal harus format YYYY-MM-DD"),
];

module.exports = { penjualanRules };
