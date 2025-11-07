const mongoose = require("mongoose");
// database connection

const connectDB = async () => {
  const DB_URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
