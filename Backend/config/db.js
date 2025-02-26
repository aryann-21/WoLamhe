const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
