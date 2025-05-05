import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Log, LogReason } from "../entities/log";
import { Product } from "../entities/product";
import { User } from "../entities/user";

export class LogController {
  // Get all logs
  static getAllLogs = async (req: Request, res: Response) => {
    try {
      const logRepository = AppDataSource.getRepository(Log);
      const logs = await logRepository.find({
        relations: ["product", "user"],
      });

      return res.status(200).json(logs);
    } catch (error) {
      console.error("Error getting logs:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get log by id
  static getLogById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid log ID" });
      }

      const logRepository = AppDataSource.getRepository(Log);
      const log = await logRepository.findOne({
        where: { id },
        relations: ["product", "user"],
      });

      if (!log) {
        return res.status(404).json({ message: "Log not found" });
      }

      return res.status(200).json(log);
    } catch (error) {
      console.error("Error getting log:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get logs by product id
  static getLogsByProductId = async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);

      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // First verify the product exists
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const logRepository = AppDataSource.getRepository(Log);
      const logs = await logRepository.find({
        where: { productId },
        relations: ["user"],
      });

      return res.status(200).json(logs);
    } catch (error) {
      console.error("Error getting logs by product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Create a new log
  static createLog = async (req: Request, res: Response) => {
    try {
      const { productId, quantityOfChange, userId, reason } = req.body;

      if (!productId || !quantityOfChange || !userId || !reason) {
        return res.status(400).json({
          message:
            "Product ID, quantity of change, user ID, and reason are required",
        });
      }

      // Verify product exists
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Verify user exists
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify reason is valid
      if (!Object.values(LogReason).includes(reason as LogReason)) {
        return res.status(400).json({
          message:
            "Invalid reason. Must be one of: " +
            Object.values(LogReason).join(", "),
        });
      }

      const log = new Log();
      log.productId = productId;
      log.quantityOfChange = quantityOfChange;
      log.movedAt = new Date();
      log.userId = userId;
      log.reason = reason as LogReason;

      // Validate log entity
      const errors = await validate(log);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const logRepository = AppDataSource.getRepository(Log);
      await logRepository.save(log);

      return res.status(201).json({
        message: "Log created successfully",
        log,
      });
    } catch (error) {
      console.error("Error creating log:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
