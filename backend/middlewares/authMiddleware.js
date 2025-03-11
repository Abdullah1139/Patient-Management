import { User } from "../models/User.js";
import { catchAsyncError } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated=catchAsyncError(async (req,res,next)=>{
  const token=req.cookies.adminToken;
  if(!token){
    return res.status(401).json({message:"You are not logged in."});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=await User.findById(decoded._id);
    if(req.user.role !== "Admin"){
      return res.status(401).json({message:"You are not an admin."});
    }
    next();

}

)

export const isPatientAuthenticated=catchAsyncError(async (req,res,next)=>{
  const token=req.cookies.patientToken;
  if(!token){
    return res.status(401).json({message:"You are not logged in."});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=await User.findById(decoded._id);
    if(req.user.role !== "Patient"){
      return res.status(401).json({message:"You are not an admin."});
    }
    next();

}

)