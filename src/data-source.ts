import { DataSource } from "typeorm";
import { Branch } from "./entities/branch";
import { Log } from "./entities/log";
import { Product } from "./entities/product";
import { User } from "./entities/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "aws-0-us-west-1.pooler.supabase.com",
  port: 6543,
  username: "postgres.agetxtbbhhdzkssdrldg",
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
