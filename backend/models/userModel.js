const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [5, "Name Should have more than 5 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greter than 8 chararters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});
// note --> we cannot use this inside arrow function.
// if password is same as before means it is not modified again then we will not bcrypt the pass
// this case will use when user change the pass if pass change then only it will brypt the pass else it will not .
// agar pass change nhi hua hai to pasword brypt nhi krna next kr dena if hua hai to usko brypt krna
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// JWt token;
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
// compare password;
userSchema.methods.comparePassWord = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
}

// Generating pasword Reset Toen
userSchema.methods.getResetPasswordToken = function(){
    // generate token
const resettoken = crypto.randomBytes(20).toString("hex");

// Hashing and adding Resetpassword token to userSchema
   this.resetPasswordToken = crypto
   .createHash("sha256")
   .update(resettoken)
   .digest("hex");

   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
   return resettoken;
}

module.exports = mongoose.model("User", userSchema)
// uerSchema