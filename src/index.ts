import "reflect-metadata";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import branchRouter from "./routers/branch.routes";
import userRouter from "./routers/user.routes";
import logRouter from "./routers/log.routes";
import productRouter from "./routers/product.routes";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:3000",
  "https://thrifty-front.vercel.app",
];

// TEMP: comment this for debugging if needed
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Add simple test route
app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ DB connected");

    app.use("/Branches", branchRouter);
    app.use("/Users", userRouter);
    app.use("/Logs", logRouter);
    app.use("/Products", productRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });