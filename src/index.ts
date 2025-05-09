import "reflect-metadata";
import "dotenv/config"; // Cargar variables de entorno al inicio
import cors from "cors";
import express from "express";
import { AppDataSource } from "./data-source";
import branchRouter from "./routers/branch.routes";
import userRouter from "./routers/user.routes";
import logRouter from "./routers/log.routes";
import productRouter from "./routers/product.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize().then(() => {
  // Register API routes
  app.use("/Branches", branchRouter);
  app.use("/Users", userRouter);
  app.use("/Logs", logRouter);
  app.use("/Products", productRouter);

  const allowedOrigins = [
    "http://localhost:4200/", // Angular local
    "http://localhost:3000/", // React local (por si acaso)
    "https://thrifty-front.vercel.app/", // Producción
  ];

  // Configurar CORS dinámico
  app.use(
    cors({
      origin: function (origin, callback) {
        // Permitir peticiones sin origen (como Postman) o desde los orígenes permitidos
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
});