const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const StockMovement = require("../models/stockMovementModel");
const Invoice = require("../models/invoiceModel");
const { storeUploadedImage } = require("../utils/storeImage");
const { parseQuantity } = require("../utils/numbers");
const raiseStockAlert = require("../utils/stockAlert");

const ownedProduct = async (id, userId, res) => {
    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    if (product.user.toString() !== userId) {
        res.status(401);
        throw new Error("User not authorized");
    }
    return product;
};

const restock = asyncHandler(async (req, res) => {
    const quantity = parseQuantity(req.body.quantity);
    if (quantity === null || quantity < 1) {
        res.status(400);
        throw new Error("Enter a whole number of units to add");
    }

    const product = await ownedProduct(req.body.productId, req.user.id, res);

    if (req.file) {
        try {
            product.image = await storeUploadedImage(req.file);
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
    }

    product.quantity = Number(product.quantity) + quantity;
    await product.save();

    await StockMovement.create({
        user: req.user._id,
        product: product._id,
        productName: product.name,
        sku: product.sku,
        type: "restock",
        quantityChange: quantity,
        quantityAfter: product.quantity,
        unitPrice: Number(product.price) || 0,
        unitCost: Number(product.cost) || 0,
        note: req.body.note || ""
    });

    await raiseStockAlert(req.user, product);
    res.status(201).json(product);
});

const checkout = asyncHandler(async (req, res) => {
    const requested = Array.isArray(req.body.lines) ? req.body.lines : null;
    if (!requested || requested.length === 0) {
        res.status(400);
        throw new Error("Add at least one product to the checkout");
    }

    const prepared = [];
    for (const line of requested) {
        const quantity = parseQuantity(line.quantity);
        if (quantity === null || quantity < 1) {
            res.status(400);
            throw new Error("Each checkout line needs a whole number of units");
        }
        const product = await ownedProduct(line.productId, req.user.id, res);
        if (Number(product.quantity) < quantity) {
            res.status(400);
            throw new Error(`${product.name} does not have enough stock`);
        }
        prepared.push({ product, quantity });
    }

    const invoiceLines = [];
    let subtotal = 0;
    let costTotal = 0;

    for (const item of prepared) {
        const { product, quantity } = item;
        const unitPrice = Number(product.price) || 0;
        const unitCost = Number(product.cost) || 0;
        product.quantity = Number(product.quantity) - quantity;
        await product.save();

        await StockMovement.create({
            user: req.user._id,
            product: product._id,
            productName: product.name,
            sku: product.sku,
            type: "checkout",
            quantityChange: -quantity,
            quantityAfter: product.quantity,
            unitPrice,
            unitCost,
            note: req.body.note || ""
        });

        await raiseStockAlert(req.user, product);

        invoiceLines.push({
            product: product._id,
            name: product.name,
            sku: product.sku,
            quantity,
            unitPrice,
            unitCost
        });
        subtotal += quantity * unitPrice;
        costTotal += quantity * unitCost;
    }

    const invoice = await Invoice.create({
        user: req.user._id,
        number: `INV-${Date.now()}`,
        lines: invoiceLines,
        subtotal: Math.round(subtotal * 100) / 100,
        costTotal: Math.round(costTotal * 100) / 100,
        profit: Math.round((subtotal - costTotal) * 100) / 100,
        note: req.body.note || ""
    });

    res.status(201).json(invoice);
});

const listMovements = asyncHandler(async (req, res) => {
    const movements = await StockMovement.find({ user: req.user.id }).sort("-createdAt").limit(50);
    res.status(200).json(movements);
});

module.exports = {
    restock,
    checkout,
    listMovements
};
