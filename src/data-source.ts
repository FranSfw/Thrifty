import { DataSource } from "typeorm";
import { Branch } from "./entities/branch";
import { Log } from "./entities/log";
import { Product } from "./entities/product";
import { User } from "./entities/user";

// Configuración con valores predeterminados en caso de que falten las variables de entorno
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "thrifty",
  synchronize: true, // En desarrollo puede ser true, pero en producción debería ser false
  logging: true,
  entities: [Branch, Log, Product, User],
  connectTimeoutMS: 10000, // Aumentar timeout de conexión a 10 segundos
  maxQueryExecutionTime: 5000, // Timeout para queries
  extra: {
    // Configuraciones adicionales para mejor manejo de errores
    max: 10, // máximo número de conexiones en el pool
    connectionTimeoutMillis: 10000, // timeout de conexión en milisegundos
  },
});

export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
};
