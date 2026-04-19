const express = require("express");
const controller = require("../controllers/produkController");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middlewares/validate");
const { produkRules, produkUpdateRules } = require("../validators/produkValidator");

const router = express.Router();

router.post("/", produkRules, validate, catchAsync(controller.createProduk));
router.get("/", catchAsync(controller.getProduk));
router.put("/:id", produkUpdateRules, validate, catchAsync(controller.updateProduk));
router.delete("/:id", catchAsync(controller.deleteProduk));

module.exports = router;
