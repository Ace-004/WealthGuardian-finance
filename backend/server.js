// external imports
const express = require("express");
const cors = require("cors");
// internal imports
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const analyticsRouter = require("./routes/analyticsRouter");
const transactionsRouter = require("./routes/transactionRouter");
const authRouter = require("./routes/authRouter");
const budgetRouter = require("./routes/budgetRouter");
dotenv.config();
// app setup
const app = express(); 
app.use(cors(process.env.CORS_OPTIONS || {}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/transactions", transactionsRouter);
app.use('/api/budgets', budgetRouter);
app.use(errorHandler);

// connect to database and start server
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    console.log("Ready to accept requests after DB connection");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  }); // server start
