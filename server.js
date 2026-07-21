import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser"; // npm install cookie-parser — not yet in package.json
import mongoSanitize from "express-mongo-sanitize";
// import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/User.js";
import customerRoutes from "./routes/Customer.js";
import followupRoutes from "./routes/Followup.js";
import campaignRoutes from "./routes/Campaign.js";
import statsRoutes from "./routes/stats.js";

const app = express();

// Connect to MongoDB
// connectDB();

// Global middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // required so the httpOnly cookie is sent/received cross-origin
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // required to read req.cookies for JWT auth
app.use(mongoSanitize()); // block NoSQL injection attempts

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CRM Backend API is running" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/followup", followupRoutes);
app.use("/api/v1/campaign", campaignRoutes);
app.use("/api/v1/stats", statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
