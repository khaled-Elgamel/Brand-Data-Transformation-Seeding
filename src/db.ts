import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/brands_db");
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error(err.message);
  }
}

export default connectDB;
