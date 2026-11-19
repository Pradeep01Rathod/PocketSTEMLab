
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const doubtRoutes = require("./routes/doubtRoutes.cjs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to EduSpark Backend!",
  });
});

// Backend health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running successfully",
  });
});

// AI Doubt Assistant routes
app.use("/api/doubts", doubtRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EduSpark backend running on port ${PORT}`);
});
