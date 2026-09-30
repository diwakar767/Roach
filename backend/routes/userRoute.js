const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, updatePhoto, changePassword, forgotPassword, resetPassword } = require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, updateUser);
router.post("/photo", protect, upload.single("photo"), updatePhoto);
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;