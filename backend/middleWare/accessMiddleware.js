const asyncHandler = require("express-async-handler");
const { hasAccess, ensureTrial } = require("../utils/access");

const requireAccess = asyncHandler(async (req, res, next) => {
    if (ensureTrial(req.user)) {
        await req.user.save();
    }
    if (!hasAccess(req.user)) {
        res.status(403);
        throw new Error("Account access is paused");
    }
    next();
});

const requireAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error("Admin only");
    }
    next();
});

module.exports = {
    requireAccess,
    requireAdmin,
};
