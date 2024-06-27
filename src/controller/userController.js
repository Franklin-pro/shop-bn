import express from 'express'
import USER from '../model/user.js'
import bcrypt from 'bcrypt'
import success from '../utilies/success.js'
import Jwt from 'jsonwebtoken'
import crypto from 'crypto'
import errormessage from '../utilies/errormessage.js'
import User from '../model/user.js'
import sendLoginEmail from '../utilies/email.js'


class userController {
  static async createUser(req,res){
    try {
        const{fullName,email,password,phoneNumber,city,address,houseNumber,streetNumber,role}=req.body
        if(!password){
            return errormessage(res,401,`password is required`)
        }
        // if(req.body.password !== req.body.confirmPassword){
        //     return errorMessage(res,401,`password and confirmpassword must be matched`)
        // }
        else{
            const hashPassword = bcrypt.hashSync(req.body.password,10)
    
            const user = await User.create({fullName,phoneNumber,city,address,email,houseNumber,streetNumber,role,password:hashPassword})
           return success(res,201,`user created successfully`,user)
        }
    } catch (error) {
        return errormessage(res,500,error)
    }
    
    }
    static async getAllUser(req,res){
        const user = await User.find()
    
        if(!user || user==0){
            return errormessage(res,401,`no user found`)
        }else{
            return success(res,200,`all users found ${user.length}`,user)
        }
    }
    static async deleteAllUser(req,res){
        const users = await User.deleteMany();
    
        if(!users){
            return errormessage(res,401,`no users deleted`)
        }else{
            return errormessage(res,200,`all users deleted`)
        }
    }
    static async getOneUser(req,res){
        const id = req.params.id
        const user = await User.findById(id)
        if(!user){
            return errormessage(res,401,`no user found ${id}`)
        }else{
            return success(res,200,`user found`,user)
        }
    }
    static async deleteOneUser(req,res){
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
        if(!user){
            return errormessage(res,401,`no user delete by ${id}`)
        }else{
            return errormessage(res,200,`user delete`)
        }
    }
    static async updateUser(req,res){
        const id = req.params.id
        const user = await User.findByIdAndUpdate(id,req.body,{new:true})
        if(!user){
            return errormessage(res,401,`no user updated by ${id}`)
        }else{
            return success(res,200,`user updated`,user)
        }
    }
    static async login(req,res){
        const{email,password}=req.body
    
        const user = await User.findOne({email})
        if(!user){
            return errormessage(res,401,`invalid email or password`)
        }else{
            const comparePassword = bcrypt.compareSync(password,user.password)
            if(!comparePassword){
                return errormessage(res,401,`invalid email or password`)
            }else{
             const token = Jwt.sign({user:user},process.env.SECRET_KEY,{expiresIn:"1d"})
             sendLoginEmail(user)
             return res.status(200).json({
                token:token,
                data:{
                    user:user
                }
            })
            }
        }
    
    }
    static async forgotPassword(req, res, next) {
        try {
          const user = await USER.findOne({ email: req.body.email });
    
          if (!user) {
            return errormessage(res, 404, 'We could not find a user with that email');
          }
    
          const resetToken = user.createResetPasswordToken();
          await user.save({ validateBeforeSave: false });
    
    
          res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
            resetToken // In real application, you would not send the token back in the response
          });
    
        } catch (error) {
          console.error(error);
          return errormessage(res, 500, 'An error occurred');
        }
      }
    
      static async resetPassword(req, res) {
        try {
          const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
          const user = await USER.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now()}
          });
    
          if (!user) {
            return errormessage(res, 400, 'Token is invalid or has expired');
          }
    
        
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save();
    
          
          const token = Jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
          });
    
          res.status(200).json({
            message:'good',
            status: 'success',
            token
          });
    
        } catch (error) {
          console.error(error);
          return errormessage(res, 500, 'An error occurred');
        }
      }
    
}
export default userController
