const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

const listNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id }).sort("-createdAt").limit(50);
    res.status(200).json(notifications);
});

const markRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
    }
    notification.read = true;
    await notification.save();
    res.status(200).json(notification);
});

const markAllRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.status(200).json({ message: "Notifications marked read" });
});

const removeNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
    }
    await notification.remove();
    res.status(200).json({ message: "Notification removed" });
});

const clearNotifications = asyncHandler(async (req, res) => {
    await Notification.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "Notifications cleared" });
});

module.exports = {
    listNotifications,
    markRead,
    markAllRead,
    removeNotification,
    clearNotifications
};
