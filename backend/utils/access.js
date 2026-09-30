const TRIAL_MS = 30 * 24 * 60 * 60 * 1000;

const trialEndFrom = (date) => {
    return new Date(new Date(date).getTime() + TRIAL_MS);
};

const ensureTrial = (user) => {
    if (!user || user.role === "admin") {
        return false;
    }
    if (!user.trialEndsAt) {
        const start = user.createdAt ? new Date(user.createdAt) : new Date();
        user.trialEndsAt = trialEndFrom(start);
        return true;
    }
    return false;
};

const hasAccess = (user) => {
    if (!user) {
        return false;
    }
    if (user.role === "admin") {
        return true;
    }
    const now = new Date();
    if (user.paidUntil && new Date(user.paidUntil) > now) {
        return true;
    }
    if (user.trialEndsAt && new Date(user.trialEndsAt) > now) {
        return true;
    }
    return false;
};

const accessStatus = (user) => {
    if (!user) {
        return "blocked";
    }
    if (user.role === "admin") {
        return "admin";
    }
    const now = new Date();
    if (user.paidUntil && new Date(user.paidUntil) > now) {
        return "active";
    }
    if (user.trialEndsAt && new Date(user.trialEndsAt) > now) {
        return "trial";
    }
    return "blocked";
};

const addMonths = (date, months) => {
    const next = new Date(date);
    const day = next.getDate();
    next.setMonth(next.getMonth() + months);
    if (next.getDate() < day) {
        next.setDate(0);
    }
    return next;
};

const nextPaidUntil = (user, months) => {
    const now = new Date();
    const stamps = [now.getTime()];
    if (user.paidUntil) {
        stamps.push(new Date(user.paidUntil).getTime());
    }
    if (user.trialEndsAt) {
        stamps.push(new Date(user.trialEndsAt).getTime());
    }
    return addMonths(new Date(Math.max(...stamps)), months);
};

module.exports = {
    trialEndFrom,
    ensureTrial,
    hasAccess,
    accessStatus,
    nextPaidUntil,
};
