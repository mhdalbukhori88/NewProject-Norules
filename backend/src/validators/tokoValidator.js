const { body } = require("express-validator");

const tokoRules = [
  body("nama_toko").trim().notEmpty().withMessage("nama_toko wajib diisi"),
  body("lokasi").trim().notEmpty().withMessage("lokasi wajib diisi"),
];

const tokoUpdateRules = [
  body("nama_toko").optional().trim().notEmpty().withMessage("nama_toko tidak boleh kosong"),
  body("lokasi").optional().trim().notEmpty().withMessage("lokasi tidak boleh kosong"),
];

module.exports = { tokoRules, tokoUpdateRules };
