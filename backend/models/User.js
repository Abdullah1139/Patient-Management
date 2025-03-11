import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


//creating scgema
const userSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
            minLength: [3, 'Name should have at least 3 characters']
        },
        lastName: {
            type: String,
            required: true,
            minLength: [3, 'Name should have at least 3 characters']
            },
        email: {
            type: String,
            required: true, 
            validate: [validator.isEmail, 'Please enter a valid email'],
            },
        phone: {
            type: String,
            required: true,
            minLength: [11, 'Phone number should have at least 11 characters'],
            maxLength: [11, 'Phone number should have at most 11 characters'],
            },
        nic:{
          type:String,
          required: true,
          minLength:[13,'NIC should have at least 13 characters'],
          maxLength:[13,'NIC should have at most 13 characters'],
        },
        dob:{
          type:Date,
          required:[true,'Please enter your date of birth'],
          },
          gender:{
            type:String,
            required:true,
            enum:['Male','Female'],

          },
          password:{
            type:String,
            required:true,
            minLength:[8,'Password should have at least 8 characters'],
            select: false  
            },
            role:{
              type:String,
              required:true,
              enum:['Admin','Patient','Doctor'],
              default:'User',
            },
            doctorDepartment:{
              type:String,
            },
            docAvatar:{
              public_id:String,
              url:String
            }
            })
            userSchema.pre('save', async function (next) {
              if (!this.isModified('password')) {
                  return next();
              }
              this.password = await bcrypt.hash(this.password, 10);
              next();
          });
          
                userSchema.methods.comparePassword= async function(enteredPassword){
                  return await bcrypt.compare(enteredPassword,this.password);
                }
                userSchema.methods.generateJsonWebToken = function () {
                  return jwt.sign(
                      { _id: this._id, role: this.role }, 
                      process.env.JWT_SECRET_KEY, 
                      { expiresIn: process.env.JWT_EXPIRES }
                  );
              };
              

            export const User= mongoose.model('hmsuser',
                userSchema)

            