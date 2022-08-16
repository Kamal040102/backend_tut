const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { response } = require('express');

// Signup Controller
module.exports.signup = async (req,res) => {
    try{
        const data = req.body;

        const userExist = await User.findOne({email:data.email})

        if(userExist){
            res.status(409).json({status:false, message:"User already registered."})
        }
        else{
            const user = new User(data)
            await user.save()

            res.status(200).json({status:true, message:"User registered."})
        }
    }
    catch(err) {
        res.status(500).json({status:false, message:err})
    }
}   

// Login Controller
module.exports.login = async (req,res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password) {
            res.status(409).json({status:false, message:"Please fill all the required fields."})
        }
        else{
            const isUser = await User.findOne({email})
    
            if(!isUser){
                res.status(401).json({status:false, message:"Invalid Credentials"})
            }
            else{
                const userAuth = await bcrypt.compare(password, isUser.password)
    
                if(!userAuth){
                    res.status(401).json({status:false, message:"Invalid Credentials"})
                }
                else{
                    // const token = jwt.sign({_id:isUser._id}, process.env.JWT_SECRET_KEY)
                    const token = await isUser.getAuthToken()
                    res.cookie('jwToken', token, {
                        maxAge: 1000 * 60 * 60 * 24,
                        httpOnly: true
                    }).status(200).json({status:true, message:isUser})
                }
            }   
        }
    }
    catch(err){
        res.status(500).json({status:false, message:err})
    }
}

// Logout Controller
module.exports.logout = (req,res) => {
    try{
        res.clearCookie('jwToken').status(200).json({status:true, message:"User Logged Out."})
    }
    catch(err){
        res.status(500).json({status:false, message:err})
    }
}

// Forget Password Controller
module.exports.forgetPassword = async (req,res) => {
    try{
        const { email } = req.body;

        const emailExist = await User.findOne({email})

        if(!emailExist){
            res.status(404).json({status:false, message:"User doesn't Exists."})
        }
        else{
            const resetToken = await emailExist.getResetToken();
            let resetPasswordLink = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}}`;
            res.status(200).json({status:true, message:resetPasswordLink})
        }
    }
    catch(err){
        res.status(500).json({status:false, message:err.message})
    }
}

// Reset Password Controller
module.exports.resetPassword = async (req,res) => {
    try{
        const token = req.params.token;
        const { password } = req.body;

        const user = await User.findOne({resetToken: token})

        if(!user){
            await user.resetResetToken()
            response.status(404).json({status:false, message:"Invalid Token Provided"})
        }
        else{
            await user.resetPasswordHandler(password)
            await user.save()
            await user.resetResetToken()
            res.status(200).json({status:true, message:"Password has been changed Successfully."})
        }
    }
    catch (err) {
        res.status(500).json({status:false, message:err.message})
    }
}

// Change Password Controller
module.exports.changePassword = async (req,res) => {
    try{
        const id = jwt.decode(req.cookies.jwToken)._id
        const user = await User.findById(id)
        console.log(user)
        const { password } = req.body;

        if(!user) {
            res.status(404).json({status:false, message:"User not found."})
        }
        else{
            const changePassword = await User.findByIdAndUpdate(user._id, {password:await bcrypt.hash(password, 12)});
            if(!changePassword){
                res.status(404).json({status:false, message:"Password can't be updated"})
            }
            else{
                await changePassword.save()
                res.status(200).json({status:true, message:"Password changed successfully."})
            }
        }
    }
    catch(err){
        res.status(500).json({status:false, message:err.message})
    }
}