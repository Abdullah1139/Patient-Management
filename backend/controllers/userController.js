import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";  
import cloudinary from 'cloudinary'

// User Registration
export const registerUser = catchAsyncError(async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nic, dob, gender, password, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !nic || !dob || !password || !role) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role,
    });

    generateToken(newUser, "User registered successfully", 201, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const loginUser = catchAsyncError(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(user, "Login successful", 200, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const addNewAdmin = catchAsyncError(async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !password || !gender) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Use User model instead of Admin
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(400).json({ message:`${isRegistered.role} is already registered with this email` });
    } 

    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      role: "Admin",  // Explicitly setting role as Admin
      password,
    });

    res.status(201).json({ 
      success: true,
      message: "Admin created successfully",
      admin
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const getAllDoctor=catchAsyncError(async (req,res) => {
  try {
    const doctors = await User.find({role:"Doctor"})
    res.status(200).json({
      success:true,
      doctors
    })
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
  
})

//get user detail
export const getUserDetail=catchAsyncError(async (req,res) =>{
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user
      });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
        }
      )
      //Admin Logout
      export const adminLogout=catchAsyncError(async (req,res) =>{
        try {
          res.status(200).cookie("adminToken","",{
            httpOnly:true,
            expires:new Date(0),
          }).json({
            success: true,
            message: "Admin logged out successfully"
            });
            } catch (error) {
              res.status(500).json({ message: "Internal Server Error", error: error.message });
              }
              }
            )

       export const patientLogout=catchAsyncError(async (req,res) =>{
        try {
                res.status(200).cookie("patientToken","",{
                  httpOnly:true,
                  expires:new Date(0),
                }).json({
                  success: true,
                  message: "Patient logged out successfully"
                  });
                  } catch (error) {
                    res.status(500).json({ message: "Internal Server Error", error: error.message });
                    }
                    }
                  )
    // add new doctor
    export const addNewDoctor=catchAsyncError(async (req,res,next) =>{
      if(!req.files|| Object.keys(req.files).length===0){
        return res.status(400).json({success:false,message:"Please upload a file"});
      }
      const {docAvatar}=req.files;
      const allowedFoemats =["image/png","image/jpeg","image/webp"]
      if(!allowedFoemats.includes(docAvatar.mimetype)){
        return res.status(400).json({success:false,message:"png or jpg only"});
        }
      const { firstName, lastName, email, phone, nic, dob, gender, password,doctorDepartment, } = req.body;
      if(!firstName||!lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment){
        return res.status(400).json({success:false,message:"Please fill in all fields"}); 
      }
      const isRegistered= await User.findOne({email});
      if(isRegistered){
        return res.status(400).json({success:false,message:`${isRegistered.role} is already registered with this email`});
        }
        const cloudinaryResponse= await cloudinary.uploader.upload(
          docAvatar.tempFilePath,{resource_type:"image"}
        );
        if(!cloudinaryResponse||cloudinaryResponse.error){
          return res.status(400).json({success:false,message:"Failed to upload image"});
          console.error('Cloudinary Error',cloudinaryResponse.error || "UnKnown Cloudinary Error")
                }
        const doctor = new User({
          role: "Doctor",
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          password,
          doctorDepartment,
          docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url 
          }
          });
          await doctor.save();
          res.status(201).json({success:true,message:"Doctor added successfully",doctor});

    })

    export const getDoctorCount = async (req, res) => {
      try {
        const totalDoctors = await User.countDocuments({ role: "Doctor" }); // Count only doctors
        res.status(200).json({ totalDoctors });
      } catch (error) {
        console.error("Error fetching doctor count:", error);
        res.status(500).json({ message: "Server Error" });
      }
    };