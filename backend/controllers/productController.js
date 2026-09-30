const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const StockMovement = require("../models/stockMovementModel");
const { storeUploadedImage } = require("../utils/storeImage");
const { parseQuantity, parseMoney } = require("../utils/numbers");
const raiseStockAlert = require("../utils/stockAlert");

const readProductFields = (body, res) => {
    const { name, category, description } = body;
    const quantity = parseQuantity(body.quantity);
    const price = parseMoney(body.price);
    const cost = parseMoney(body.cost);
    const reorderLevel = body.reorderLevel === undefined || body.reorderLevel === ""
        ? 5
        : parseQuantity(body.reorderLevel);

    if (!name || !category || !description || body.quantity === undefined || body.quantity === "" || body.price === undefined || body.price === "") {
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    if (quantity === null || price === null || cost === null || reorderLevel === null) {
        res.status(400);
        throw new Error("Quantity, price, cost, and reorder level must be valid numbers");
    }

    return {
        name,
        category,
        quantity,
        price,
        cost,
        reorderLevel,
        description,
        benefits: body.benefits || "",
        useCases: body.useCases || ""
    };
};

const recordAdjustment = async (user, product, previousQuantity) => {
    const nextQuantity = Number(product.quantity);
    if (nextQuantity === Number(previousQuantity)) {
        return;
    }
    await StockMovement.create({
        user: user._id,
        product: product._id,
        productName: product.name,
        sku: product.sku,
        type: "adjustment",
        quantityChange: nextQuantity - Number(previousQuantity),
        quantityAfter: nextQuantity,
        unitPrice: Number(product.price) || 0,
        unitCost: Number(product.cost) || 0,
        note: ""
    });
};

const createProduct = asyncHandler(async (req, res) => {
    const fields = readProductFields(req.body, res);
    const { sku } = req.body;

    if (!sku) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    let fileData = {};
    if (req.file) {
        try {
            fileData = await storeUploadedImage(req.file);
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
    }

    const product = await Product.create({
        user: req.user.id,
        sku,
        ...fields,
        image: fileData
    });

    await raiseStockAlert(req.user, product);
    res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(products);
});

const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await product.remove();
    res.status(200).json({ message: "Product Deleted Successfully." });
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    const fields = readProductFields(req.body, res);
    const previousQuantity = Number(product.quantity);

    let fileData = {};
    if (req.file) {
        try {
            fileData = await storeUploadedImage(req.file);
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be uploaded");
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            ...fields,
            image: Object.keys(fileData).length === 0 ? product.image : fileData
        },
        {
            new: true,
            runValidators: true
        }
    );

    await recordAdjustment(req.user, updatedProduct, previousQuantity);
    await raiseStockAlert(req.user, updatedProduct);
    res.status(201).json(updatedProduct);
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
};
