const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

module.exports.isLoggedIn = (req,res,next) => {
    try{
        if(jwt.verify(req.cookies.jwToken, process.env.JWT_SECRET_KEY)){
            next()
        }
        else{
            res.status(404).json({status:false, message:"Invalid JWT."})
        }
    }
    catch(err){
        res.status(401).json({status:false, message:"Unauthorized Access"})
    }
}

module.exports.isAdmin = async (req,res,next) => {
    try{
        if(jwt.verify(req.cookies.jwToken, process.env.JWT_SECRET_KEY)){
            const token = jwt.decode(req.cookies.jwToken);
            const data = await User.findById(token._id)
            
            if(data.role === 'admin'){
                next()
            }
            else{
                res.status(401).json({status:false, message:"Unauthorized Access"})
            }
        }
        else{
            res.status(404).json({status:false, message:"Invalid JWT."})
        }
    }
    catch(err){
        res.status(401).json({status:false, message:"Unauthorized Access"})
    }
}