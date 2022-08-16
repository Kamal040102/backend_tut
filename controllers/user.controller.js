const User = require('../models/user.model')

module.exports.getUserByID = async (req,res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user){
            res.status(404).json({status:false, message:`ID:${req.params.id} not found`})
        }
        else{
            res.status(200).json({status:true, message:user})
        }
    }
    catch(err){
        res.status(500).json({status:500, message:err})
    }
}

module.exports.updateUserByID = async (req,res) => {
    try{
        const data = req.body;

        const updateUser = await User.findByIdAndUpdate(req.params.id, data);

        if(!updateUser){
            res.status(404).json({status:false, message:`ID:${req.params.id} not found`})
        }
        else{
            res.status(200).json({status:true, message:await User.findById(req.params.id)})
        }
    }
    catch(err){
        res.status(500).json({status:false, message:err})
    }
}

module.exports.deleteUserByID = async (req,res) => {
    try{
        const deleteUser = await User.findByIdAndDelete(req.params.id)

        if(!deleteUser){
            res.status(404).json({status:false, message:`ID:${req.params.id} not found`})
        }
        else{
            res.status(200).json({status:true, message:"User deleted."})
        }
    }
    catch(err){
        res.status(500).json({status:false, message:err})
    }
}

module.exports.getAllUser = async (req,res) => {
    try{
        const data = await User.find()

        if(!data){
            res.status(400).json({status:false, message:"No users."})
        }
        else{
            res.status(200).json({status:true, message:data})
        }
    }
    catch(err){
        res.status(500).json({status:false, message:err})
    }
}