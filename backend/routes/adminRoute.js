const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { requireAdmin } = require("../middleWare/accessMiddleware");
const { listUsers, recordPayment, blockUser } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", protect, requireAdmin, listUsers);
router.post("/users/:id/payments", protect, requireAdmin, recordPayment);
router.post("/users/:id/block", protect, requireAdmin, blockUser);

module.exports = router;
