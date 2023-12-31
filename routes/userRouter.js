const express = require("express");

const router = express.Router();

const authController = require("../controller/authController.js");
const userController = require("../controller/userController.js");

router.post("/login", authController.login);

module.exports = router;
