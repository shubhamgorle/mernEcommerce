const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileUpload")
const errorMiddleWare = require("./middleware/error.js")
const path = require("path");

if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"});
}

// middlewares
app.use(express.json());
app.use(cookieparser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload())

// Route Import
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userroute.js");
const orderRoute = require("./routes/orderRoute.js")
const paymentRoute = require("./routes/paymentRoute.js")
app.use("/api/v1", productRoute)
app.use("/api/v1", userRoute)
app.use("/api/v1", orderRoute)
app.use("/api/v1", paymentRoute)

// for deployemet
app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})

// MiddleWare for error
app.use(errorMiddleWare)

module.exports = app;
