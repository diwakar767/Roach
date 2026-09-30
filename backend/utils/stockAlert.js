const Notification = require("../models/notificationModel");
const sendEmail = require("./sendEmail");

const escapeHtml = (value) => {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    }[char]));
};

const raiseStockAlert = async (user, product) => {
    const quantity = Number(product.quantity);
    const reorderLevel = Number(product.reorderLevel ?? 5);
    let type = null;
    if (quantity <= 0) {
        type = "out_of_stock";
    } else if (quantity <= reorderLevel) {
        type = "low_stock";
    }
    if (!type) {
        return;
    }

    const existing = await Notification.findOne({
        user: user._id,
        product: product._id,
        type,
        read: false
    });
    if (existing) {
        return;
    }

    const title = type === "out_of_stock"
        ? `${product.name} is out of stock`
        : `${product.name} is low on stock`;
    const body = type === "out_of_stock"
        ? `${product.name} (${product.sku}) has no units left.`
        : `${product.name} (${product.sku}) has ${quantity} left. Reorder level is ${reorderLevel}.`;

    await Notification.create({
        user: user._id,
        product: product._id,
        type,
        title,
        body,
        read: false
    });

    if (!sendEmail.emailConfigured()) {
        return;
    }

    try {
        await sendEmail(
            title,
            `<p>${escapeHtml(body)}</p>`,
            user.email,
            process.env.EMAIL_USER
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = raiseStockAlert;
