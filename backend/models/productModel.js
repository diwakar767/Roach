const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true
    },
    sku: {
        type: String,
        required: [true],
        default: "SKU",
        trim: true
    },
    category: {
        type: String,
        required: [true, "Please add a category"],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "Please add a quantity"]
    },
    price: {
        type: Number,
        required: [true, "Please add a price"]
    },
    cost: {
        type: Number,
        default: 0
    },
    reorderLevel: {
        type: Number,
        default: 5
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true
    },
    benefits: {
        type: String,
        default: ""
    },
    useCases: {
        type: String,
        default: ""
    },
    image: {
        type: Object,
        default: {}
    }
    
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;