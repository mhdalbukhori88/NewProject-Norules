const express = require("express");
const controller = require("../controllers/stokController");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middlewares/validate");
const { stokRules, stokUpdateRules } = require("../validators/stokValidator");

const router = express.Router();

router.post("/", stokRules, validate, catchAsync(controller.createStok));
router.get("/", catchAsync(controller.getStok));
router.put("/:id", stokUpdateRules, validate, catchAsync(controller.updateStok));
router.delete("/:id", catchAsync(controller.deleteStok));

module.exports = router;
