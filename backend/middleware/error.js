const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong mongoDb Id error
    if (err.name === "CastError") {
        const message = `Resource Not Found. Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }
    //  Mongoose duplicate key error ---> if we are try to register by already registered email.
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }
   
     // Wrong JWT error
     if (err.name === "jsonWebTookenError") {
        const message = `Json Web Token is invalid, try again`
        err = new ErrorHandler(message, 400)
    }

     //JWT expire error
     if (err.name === "jsonWebTookenError") {
        const message = `Json Web Token is Expired, try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statuscode).json({
        success: false,
        message: err.message
    })
}
