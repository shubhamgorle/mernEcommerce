const Product = require("../models/productModels.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError = require('../middleware/catchAsyncErrors');
const ApiFeatures = require("../utils/apiFeatures.js");
const cloudinary = require("cloudinary");


// create products - Admin

exports.createProduct = catchAsyncError(async (req, res, next) => {
    let images = [];
    if (typeof (req.body.images) === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.Images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});

// get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    // return next(new ErrorHandler("this my temp error", 500))
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments()
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
    let products = await apiFeatures.query.clone();
    let filterdProductCount = products.length;
    apiFeatures.pagination(resultPerPage);
    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filterdProductCount
    })
})

// get all product admin
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    // return next(new ErrorHandler("this my temp error", 500))
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})

// update product-Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        // return res.status(500).json({
        //     success: false,
        //     message: "Product not found"
        // })
        return next(new ErrorHandler("Product Not Found", 404))
    }

    // images start here
    let images = [];
    if (typeof (req.body.images) === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    const imagesLinks = [];
    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.Images.length; i++) {
            await cloudinary.v2.uploader.destroy(
                product.Images[i].public_id
            )
        }

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        req.body.Images = imagesLinks;
    }



    // req.body.user = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
})

// Delete 

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        // return res.status(500).json({
        //     success: false,
        //     message: "Product not found"
        // })
        return next(new ErrorHandler("Product Not Found", 404))
    }

    // Deleting Images From Cloudinary

    for (let i = 0; i < product.Images.length; i++) {
        await cloudinary.v2.uploader.destroy(
            product.Images[i].public_id
        )
    }
    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Is Successfully Deleted"
    })
})

//  Get product Details ---Single product 
exports.productDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})


// create new review or update the reviews

exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const reviews = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = Number(rating);
                rev.comment = comment;
            }
        })
    } else {
        product.reviews.push(reviews);
        product.numOfReviews = product.reviews.length
    }
    let avg = 0;
    product.reviews.forEach(rev => {
        avg = avg + rev.rating
    })
    product.ratings = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true,
        product
    })
})

// get all reviews of the product

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


// delete reviewa

exports.deleteProductReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Review Not Found", 404))
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())
    let avg = 0;
    reviews.forEach(rev => {
        avg = avg + rev.rating
    })
    let ratings = 0;
    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        message: "Review Is Successfully Deleted"
    })
})