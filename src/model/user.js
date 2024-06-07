import mongoose from "mongoose";
import crypto from 'crypto'

const userschemas = new mongoose.Schema({

    fullName:{type:String,required:true},
    phoneNumber:{type:Number,required:true},
    email:{type:String,required:true},
    houseNumber:{type:String,required:true},
    streetNumber:{type:String,required:true},
    password:{type:String,required:true},
    city:{type:String,required:true},
    address:{type:String,required:true},
    role:{type:String,enum:["user","admin"],default:"user"},
    signedAt:{type:Date,default:new Date(Date.now())},
    passwordChangesAt : Date,
    passwordResetToken:String,
    passwordResetExpires:Date

})

userschemas.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; 
  
    console.log(resetToken, this.passwordResetToken);
  
    return resetToken;
  };
const User = mongoose.model("User",userschemas)
export default User