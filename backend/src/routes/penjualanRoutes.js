const express = require("express");
const controller = require("../controllers/penjualanController");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middlewares/validate");
const { penjualanRules } = require("../validators/penjualanValidator");

const router = express.Router();

router.post("/", penjualanRules, validate, catchAsync(controller.createPenjualan));
router.get("/hari-ini", catchAsync(controller.getPenjualanHariIni));
router.get("/toko/:id", catchAsync(controller.getPenjualanByToko));
router.get("/laporan", catchAsync(controller.getLaporanPenjualan));

module.exports = router;
