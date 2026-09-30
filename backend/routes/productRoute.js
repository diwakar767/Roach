const express = require("express");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const protect = require("../middleWare/authMiddleware");
const { requireAccess } = require("../middleWare/accessMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

router.post("/", protect, requireAccess, upload.single("image"), createProduct);
router.patch("/:id", protect, requireAccess, upload.single("image"), updateProduct);
router.get("/", protect, requireAccess, getProducts);
router.get("/:id", protect, requireAccess, getProduct);
router.delete("/:id", protect, requireAccess, deleteProduct);


module.exports = router;