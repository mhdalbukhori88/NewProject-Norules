const { body } = require("express-validator");

const produkRules = [
  body("nama_produk").trim().notEmpty().withMessage("nama_produk wajib diisi"),
  body("harga").isDecimal({ decimal_digits: "0,2" }).withMessage("harga harus berupa angka desimal"),
];

const produkUpdateRules = [
  body("nama_produk").optional().trim().notEmpty().withMessage("nama_produk tidak boleh kosong"),
  body("harga").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("harga harus berupa angka desimal"),
];

module.exports = { produkRules, produkUpdateRules };
