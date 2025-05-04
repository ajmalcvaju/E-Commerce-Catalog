import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "../backend/middlewares/errorMiddleware.js"
dotenv.config();

const mongo=process.env.MONGO;


mongoose
  .connect(mongo)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(cors({
  origin: [
    'http://localhost:5173'
  ],
  credentials: true,
}));

app.use("/api", productRoutes);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("server listen on port 3000");
});



