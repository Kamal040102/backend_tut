const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    contact:{
        type:Number
    },
    role:{
        type:String,
        enum:['admin', 'shop-owner', 'delivery', 'user'],
        default:'user'
    },
    tokens:[
        {
            token:{
                type:String
            }
        }
    ],
    resetToken:{
        type:String
    }
},
{
    timestamps:true
})

userSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

userSchema.methods.getAuthToken = async function () {
    try{
        let token = jwt.sign({_id:this._id}, process.env.JWT_SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token;
    }
    catch(err){
        console.log(err)
    }
}

userSchema.methods.getResetToken = async function() {
    try{
        let token = jwt.sign({_id:this._id}, process.env.JWT_RESET_PASS_KEY)
        this.resetToken = token
        await this.save()
        return token;
    }
    catch(err){
        console.log(err)
    }
}

userSchema.methods.resetPasswordHandler = async function (pass) {
    try{
        this.password = pass;
        await this.save()
    }
    catch(err){
        console.log(err)
    }
}

userSchema.methods.resetResetToken = async function () {
    try{
        this.resetToken = ""
        await this.save()
    }
    catch(err){
        console.log(err)
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User;