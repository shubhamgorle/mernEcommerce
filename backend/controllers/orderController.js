const Order = require("../models/orderModels");
const Product = require("../models/productModels.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError = require('../middleware/catchAsyncErrors');

// Create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    res.status(201).json({
        success: true,
        order
    });
})

// get Single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    res.status(200).json({
        success: true,
        order
    })
})

// get loggedin user order
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })

    res.status(200).json({
        success: true,
        orders
    })
})

// get all order- Admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmout = 0;
    orders.forEach((order) => {
        totalAmout += order.totalPrice;
    })
    res.status(200).json({
        success: true,
        totalAmout,
        orders
    })
})

// update-order-status--->Admin

exports.updateOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);
    if (!orders) {
        return next(new ErrorHandler("Order not found with this id", 404))
    }
    if (orders.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400))
    }
    if(req.body.status === "Shipped"){
        orders.orderItems.forEach(async (order) => {
            await updateStock(order.product, order.quantity);
        });
    }
    orders.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        orders.deliverdAt = Date.now();
        orders.orderStatus = "Delivered";
    }
    await orders.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    })
})


async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}


// delete order  ---Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);
    if (!orders) {
        return next(new ErrorHandler("Order not found with this id", 404))
    }
    await orders.deleteOne();
    res.status(200).json({
        success: true,

    })
})