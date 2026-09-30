const asyncHandler = require("express-async-handler");
const Invoice = require("../models/invoiceModel");
const StockMovement = require("../models/stockMovementModel");

const reportSummary = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ user: req.user.id }).sort("-createdAt");
    let unitsSold = 0;
    let revenue = 0;
    let cost = 0;
    let profit = 0;

    invoices.forEach((invoice) => {
        revenue += invoice.subtotal;
        cost += invoice.costTotal;
        profit += invoice.profit;
        invoice.lines.forEach((line) => {
            unitsSold += line.quantity;
        });
    });

    const movements = await StockMovement.find({ user: req.user.id }).sort("-createdAt").limit(50);

    res.status(200).json({
        unitsSold,
        revenue: Math.round(revenue * 100) / 100,
        cost: Math.round(cost * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        invoices: invoices.slice(0, 50),
        movements
    });
});

const getInvoice = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
        res.status(404);
        throw new Error("Invoice not found");
    }
    if (invoice.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }
    res.status(200).json(invoice);
});

module.exports = {
    reportSummary,
    getInvoice
};
