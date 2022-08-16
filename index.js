const express = require('express')
const cors = require('cors')
require('dotenv').config({path:"./config/config.env"})
const cookieParser = require('cookie-parser')

require('./database/connection.database')
const authRoute = require('./routes/auth.route')
const userRoute = require('./routes/user.route')

const app = express()
const PORT = process.env.PORT || 9999;
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get('/', (req,res)=>{
    try{
        res.status(200).json({status:true, message:"Server is working fine."})
    }
    catch(err){
        res.status(500).json({status:false, message:err})
    }
})

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)

app.listen(PORT, ()=> {
    console.log(`Server is live on http://localhost:${PORT}`);
})