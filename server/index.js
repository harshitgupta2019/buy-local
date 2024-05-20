const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app=express();
dotenv.config();
app.use(express.json({limit:"30mb",extended:true}))
app.use(express.urlencoded({limit:"30mb",extended:true}))
// app.use(cors());

app.get('/',(req,res)=>{
    res.send("Hello, We are on a mission to reduce the problems of local people")
})
const PORT= process.env.PORT || 5000

const  DATABASE_URL=""
mongoose.connect(DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)}))
.catch((err)=>console.log(err.message))