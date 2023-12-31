const express = require("express");

const router = express.Router();

const authController = require("../controller/authController.js");
const saleController = require("../controller/saleController.js");

router.post("/", authController.protect, saleController.addSaleTransaction);

module.exports = router;
