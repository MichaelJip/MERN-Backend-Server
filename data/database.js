import mongoose from "mongoose";

mongoose.set("strictQuery", false);
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "UdemyCourse",
    });
    console.log(`server connected to data base ${connection.host}`);
  } catch (error) {
    console.log("Some Error Occured", error);
    process.exit(1);
  }
};
