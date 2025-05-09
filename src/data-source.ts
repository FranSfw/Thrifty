import { DataSource } from "typeorm";
import { Branch } from "./entities/branch";
import { Log } from "./entities/log";
import { Product } from "./entities/product";
import { User } from "./entities/user";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  synchronize: true, // En desarrollo puede ser true, pero en producción debería ser false
  logging: true,
  entities: [Branch, Log, Product, User],
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
