import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const con = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://0.0.0.0:27017/development"
    );
    console.log("database connected..");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDb;
