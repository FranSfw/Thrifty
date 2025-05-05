import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import branchRouter from "./routers/branch.routes";
import userRouter from "./routers/user.routes";
import logRouter from "./routers/log.routes";
import productRouter from "./routers/product.routes";

const app = express();
app.use(express.json());

AppDataSource.initialize().then(() => {
  // Register API routes
  app.use("/Branches", branchRouter);
  app.use("/Users", userRouter);
  app.use("/Logs", logRouter);
  app.use("/Products", productRouter);

  app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });
});
