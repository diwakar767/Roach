const mongoose = require("mongoose");

const stockMovementSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    productName: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        required: true,
        enum: ["restock", "checkout", "adjustment"]
    },
    quantityChange: {
        type: Number,
        required: true
    },
    quantityAfter: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    unitCost: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
module.exports = StockMovement;
