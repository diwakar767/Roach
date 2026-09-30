const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { requireAccess } = require("../middleWare/accessMiddleware");
const { upload } = require("../utils/fileUpload");
const { restock, checkout, listMovements } = require("../controllers/stockController");

const router = express.Router();

router.post("/restock", protect, requireAccess, upload.single("image"), restock);
router.post("/checkout", protect, requireAccess, checkout);
router.get("/movements", protect, requireAccess, listMovements);

module.exports = router;
