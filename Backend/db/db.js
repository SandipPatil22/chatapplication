import mongoose from "mongoose";

const connectDB = async () => {
  try {
     await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `\n DataBase connected..`
    );
  } catch (error) {
    console.log("mongoDB connection error:", error);

    process.exit(1);
  }
};
export default connectDB;
