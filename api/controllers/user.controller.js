import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.models.js'
import Listing from "../models/listing.model.js"
export const test=(req,res)=>{
    res.json({status:'OK:200'})
};

export const updateUser =async(req,res,next)=>{
   if(req.user.id!=req.params.id)
   {
    return next(errorHandler(401,'You can only updtae your account'))
   }
   try{
    if(req.body.password){
        req.body.password=bcryptjs.hashSync(req.body.password,10);
    }
    const updatedUser=await User.findByIdAndUpdate(req.params.id,
        {$set:{
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar,
        }
    },{new:true});
    const {password, ...rest}=updatedUser._doc;
    res.status(200).json(rest);
   }
   catch(error){
    next(error);
   }
};
export const deleteUser = async (req,res,next) => {
  if (req.user.id != req.params.id) {
    return next(errorHandler(401, "You can only delete your account"));
  }
  try{
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User is deleted');
  } catch(e){
    next(e);
  }
};

export const getUserListings = async (req,res,next) => {
    if(req.user.id===req.params.id){
      try {
        const listings = await Listing.find({userRef: req.params.id});
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can view your own listings only!'));
    }
  }