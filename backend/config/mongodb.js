import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "capstonefinal"  
    });
    console.log("Database Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
  }
};

export default connectDB;
