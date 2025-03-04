import mongoose from "mongoose";

export async function dbConnect(){

        mongoose.connect(process.env.MONGO_URL)
        .then(() => 
            console.log("MongoDB Connected..."))
        .catch (error=>{
            console.log(error);
        })
}