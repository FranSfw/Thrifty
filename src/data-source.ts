import { DataSource } from "typeorm";
import { Branch } from "./entities/branch";
import { Log } from "./entities/log";
import { Product } from "./entities/product";
import { User } from "./entities/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db.agetxtbbhhdzkssdrldg.supabase.co",
  port: 5432,
  username: "postgres",
  password: "LuisUxiono33",
  database: "postgres",
  synchronize: true, // En desarrollo puede ser true, pero en producción debería ser false
  logging: false,
  entities: [Branch, Log, Product, User],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
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
