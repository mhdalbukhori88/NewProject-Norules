const express = require("express");
const controller = require("../controllers/tokoController");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middlewares/validate");
const { tokoRules, tokoUpdateRules } = require("../validators/tokoValidator");

const router = express.Router();

router.post("/", tokoRules, validate, catchAsync(controller.createToko));
router.get("/", catchAsync(controller.getToko));
router.put("/:id", tokoUpdateRules, validate, catchAsync(controller.updateToko));
router.delete("/:id", catchAsync(controller.deleteToko));

module.exports = router;
