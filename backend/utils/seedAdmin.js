const User = require("../models/userModel");

const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
        return;
    }

    const existing = await User.findOne({ email });
    if (!existing) {
        await User.create({
            name: "Roach Admin",
            email,
            password,
            role: "admin"
        });
        console.log("Admin account created");
        return;
    }

    if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
    }
};

module.exports = seedAdmin;
