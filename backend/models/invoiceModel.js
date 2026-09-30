const mongoose = require("mongoose");

const lineSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    unitCost: {
        type: Number,
        default: 0
    }
}, { _id: false });

const invoiceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    number: {
        type: String,
        required: true
    },
    lines: {
        type: [lineSchema],
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    costTotal: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
