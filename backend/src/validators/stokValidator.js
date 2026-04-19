const { body } = require("express-validator");

const stokRules = [
  body("toko_id").isInt({ min: 1 }).withMessage("toko_id harus berupa angka positif"),
  body("produk_id").isInt({ min: 1 }).withMessage("produk_id harus berupa angka positif"),
  body("jumlah_stok").isInt({ min: 0 }).withMessage("jumlah_stok minimal 0"),
];

const stokUpdateRules = [
  body("toko_id").optional().isInt({ min: 1 }).withMessage("toko_id harus berupa angka positif"),
  body("produk_id").optional().isInt({ min: 1 }).withMessage("produk_id harus berupa angka positif"),
  body("jumlah_stok").optional().isInt({ min: 0 }).withMessage("jumlah_stok minimal 0"),
];

module.exports = { stokRules, stokUpdateRules };
