import "reflect-metadata";
import cors from "cors";
import express from "express";
import { AppDataSource } from "./data-source";
import branchRouter from "./routers/branch.routes";
import userRouter from "./routers/user.routes";
import logRouter from "./routers/log.routes";
import productRouter from "./routers/product.routes";

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:4200/",
  "http://localhost:3000/",
  "https://thrifty-front.vercel.app/",
];

// ✅ Configurar CORS antes de las rutas
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

AppDataSource.initialize().then(() => {
  // ✅ Registrar rutas después de aplicar CORS
  app.use("/Branches", branchRouter);
  app.use("/Users", userRouter);
  app.use("/Logs", logRouter);
  app.use("/Products", productRouter);
});