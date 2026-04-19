const express = require("express");

const tokoRoutes = require("./tokoRoutes");
const produkRoutes = require("./produkRoutes");
const stokRoutes = require("./stokRoutes");
const penjualanRoutes = require("./penjualanRoutes");

const router = express.Router();

router.use("/toko", tokoRoutes);
router.use("/produk", produkRoutes);
router.use("/stok", stokRoutes);
router.use("/penjualan", penjualanRoutes);

module.exports = router;
