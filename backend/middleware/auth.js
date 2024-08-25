const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel");
exports.isAuthenticatedUser = catchAsyncErrors(
    async (req, res, next) => {
        const { token } = req.cookies;
        if (!token) {
            return next(new ErrorHandler("Please Login To Access This Resources", 401))
        }
        const decodesData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decodesData.id)
        next();
    })

exports.authoriseRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resource`, 403
            ))
        }
        next();
    }
}