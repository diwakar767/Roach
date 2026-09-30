const express = require("express");
const { contactUs } = require("../controllers/contactController");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const { requireAccess } = require("../middleWare/accessMiddleware");

router.post("/", protect, requireAccess, contactUs);

module.exports = router;
