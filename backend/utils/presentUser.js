const { ensureTrial, accessStatus } = require("./access");

const presentUser = async (user) => {
    if (ensureTrial(user)) {
        await user.save();
    }
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        phone: user.phone,
        bio: user.bio,
        role: user.role || "user",
        trialEndsAt: user.trialEndsAt || null,
        paidUntil: user.paidUntil || null,
        access: accessStatus(user),
    };
};

module.exports = presentUser;
