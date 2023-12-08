import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
const uri = process.env.MONGO; // Use the environment variable
mongoose.connect(uri)
// dotenv.config();
// mongoose.connect(process.env.MONGO,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log('connected to mongodb')
}).catch((err)=>{
    console.log(err)
})
const app=express();
app.use(express.json());
app.use(cookieParser());
app.listen(8000,()=>{
    console.log("app is running")
    // console.log(process.env.MONGO)
})
// app.get('/test',(req,res)=>{
//     res.json({status:'OK:200'})
// });
app.use("/api/user",userRouter)
app.use("/api/auth",authRoute)
app.use("/api/listing", listingRouter);
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'Internal server Eroor';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})