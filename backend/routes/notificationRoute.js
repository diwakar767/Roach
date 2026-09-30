const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { requireAccess } = require("../middleWare/accessMiddleware");
const {
    listNotifications,
    markRead,
    markAllRead,
    removeNotification,
    clearNotifications
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, requireAccess, listNotifications);
router.patch("/read-all", protect, requireAccess, markAllRead);
router.delete("/", protect, requireAccess, clearNotifications);
router.patch("/:id/read", protect, requireAccess, markRead);
router.delete("/:id", protect, requireAccess, removeNotification);

module.exports = router;
