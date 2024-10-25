import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";
import path from "path";

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_API,
  api_secret: process.env.Cloud_Secret,
});
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from Vite's dev server
  })
);

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
  connectDb();
});
