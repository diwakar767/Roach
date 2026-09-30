const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    months: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        default: null
    },
    note: {
        type: String,
        default: ""
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    paidUntil: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
