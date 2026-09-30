const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    type: {
        type: String,
        required: true,
        enum: ["low_stock", "out_of_stock"]
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
