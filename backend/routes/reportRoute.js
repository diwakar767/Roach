const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { requireAccess } = require("../middleWare/accessMiddleware");
const { reportSummary, getInvoice } = require("../controllers/reportController");

const router = express.Router();

router.get("/summary", protect, requireAccess, reportSummary);
router.get("/invoices/:id", protect, requireAccess, getInvoice);

module.exports = router;
