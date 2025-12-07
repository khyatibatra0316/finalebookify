import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect Database
connectDB();

// CORS must be configured BEFORE other middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Updated to match frontend port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/books", bookRoutes);

// Start Server
app.listen(port, () => console.log(`Server is running on PORT: ${port}`));
