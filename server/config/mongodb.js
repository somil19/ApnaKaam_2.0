import mongoose from "mongoose";
import dotenv from "dotenv/config";
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDB;
