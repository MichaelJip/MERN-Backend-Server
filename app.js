import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({
  path: "./data/config.env",
});
export const app = express();

// using Middleware

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [process.env.FRONTEND_URL_1],
  })
);

app.get("/", (req, res, next) => {
  res.send("Working");
});

// Import Routers here

import user from "./routes/user.js";
import product from "./routes/product.js";
import order from "./routes/order.js";
import { errorMiddleware } from "./middleware/error.js";

app.use("/api/v1/user", user);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);

// Using Error Middleware

app.use(errorMiddleware);
