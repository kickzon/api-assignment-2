import mongoose from "mongoose";

let connectionPromise: ReturnType<typeof mongoose.connect> | null = null;

const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error(
        "MONGODB_URL is not defined in the environment variables",
      );
    }

    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(mongoUrl).then((connection) => {
        console.log("MongoDB connected successfully");
        return connection;
      });
    }

    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectDB;
