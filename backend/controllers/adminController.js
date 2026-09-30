const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const presentUser = require("../utils/presentUser");
const { ensureTrial, nextPaidUntil } = require("../utils/access");

const listUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").sort("-createdAt");
    const profiles = [];
    for (const user of users) {
        profiles.push(await presentUser(user));
    }
    res.status(200).json(profiles);
});

const recordPayment = asyncHandler(async (req, res) => {
    const months = Number(req.body.months === undefined || req.body.months === "" ? 1 : req.body.months);
    if (!Number.isInteger(months) || months < 1 || months > 36) {
        res.status(400);
        throw new Error("Months must be a whole number from 1 to 36");
    }

    let amount = null;
    if (req.body.amount !== undefined && req.body.amount !== "") {
        amount = Number(req.body.amount);
        if (!Number.isFinite(amount) || amount < 0) {
            res.status(400);
            throw new Error("Amount must be zero or more");
        }
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (user.role === "admin") {
        res.status(400);
        throw new Error("Admin access does not expire");
    }

    ensureTrial(user);
    const paidUntil = nextPaidUntil(user, months);
    user.paidUntil = paidUntil;
    await user.save();

    await Payment.create({
        user: user._id,
        months,
        amount,
        note: req.body.note || "",
        recordedBy: req.user._id,
        paidUntil
    });

    res.status(201).json(await presentUser(user));
});

const blockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (user.role === "admin") {
        res.status(400);
        throw new Error("Admin access cannot be blocked");
    }

    user.paidUntil = null;
    user.trialEndsAt = new Date(Date.now() - 1000);
    await user.save();
    res.status(200).json(await presentUser(user));
});

module.exports = {
    listUsers,
    recordPayment,
    blockUser
};
