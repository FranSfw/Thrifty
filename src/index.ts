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

const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:3000",
  "https://thrifty-front.vercel.app",
];


// Inicializar conexión a la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida con éxito");

    // ✅ Registrar rutas después de aplicar CORS
    app.use("/Branches", branchRouter);
    app.use("/Users", userRouter);
    app.use("/Logs", logRouter);
    app.use("/Products", productRouter);

    // Iniciar el servidor solo después de conectar a la BD
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1); // Terminar el proceso si no se puede conectar a la BD
  });
