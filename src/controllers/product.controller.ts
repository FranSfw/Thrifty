import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Product, ProductCategory } from "../entities/product";
import { Branch } from "../entities/branch";

export class ProductController {
  // Get all products
  static getAllProducts = async (req: Request, res: Response) => {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find({
        relations: ["branch", "logs"],
      });

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get product by id
  static getProductById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id },
        relations: ["branch", "logs"],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get products by branch id
  static getProductsByBranchId = async (req: Request, res: Response) => {
    try {
      const branchId = parseInt(req.params.branchId);

      if (isNaN(branchId)) {
        return res.status(400).json({ message: "Invalid branch ID" });
      }

      // First verify the branch exists
      const branchRepository = AppDataSource.getRepository(Branch);
      const branch = await branchRepository.findOne({
        where: { id: branchId },
      });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find({
        where: { branchId },
        relations: ["logs"],
      });

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products by branch:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Create a new product
  static createProduct = async (req: Request, res: Response) => {
    try {
      const {
        productName,
        description,
        category,
        initialQuantity,
        branchId,
        imageSrc,
      } = req.body;

      if (
        !productName ||
        !category ||
        initialQuantity === undefined ||
        !branchId
      ) {
        return res.status(400).json({
          message:
            "Product name, category, initial quantity, and branch ID are required",
        });
      }

      // Verify category is valid
      if (
        !Object.values(ProductCategory).includes(category as ProductCategory)
      ) {
        return res.status(400).json({
          message:
            "Invalid category. Must be one of: " +
            Object.values(ProductCategory).join(", "),
        });
      }

      // Verify branch exists
      const branchRepository = AppDataSource.getRepository(Branch);
      const branch = await branchRepository.findOne({
        where: { id: branchId },
      });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      const product = new Product();
      product.productName = productName;
      product.description = description || "";
      product.category = category as ProductCategory;
      product.initialQuantity = initialQuantity;
      product.imageSrc = imageSrc || null;
      product.addedAt = new Date();
      product.branchId = branchId;

      // Validate product entity
      const errors = await validate(product);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const productRepository = AppDataSource.getRepository(Product);
      await productRepository.save(product);

      return res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update product
  static updateProduct = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const {
        productName,
        description,
        category,
        initialQuantity,
        branchId,
        imageSrc,
      } = req.body;

      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({ where: { id } });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Verify category is valid if provided
      if (
        category &&
        !Object.values(ProductCategory).includes(category as ProductCategory)
      ) {
        return res.status(400).json({
          message:
            "Invalid category. Must be one of: " +
            Object.values(ProductCategory).join(", "),
        });
      }

      // Verify branch exists if provided
      if (branchId) {
        const branchRepository = AppDataSource.getRepository(Branch);
        const branch = await branchRepository.findOne({
          where: { id: branchId },
        });

        if (!branch) {
          return res.status(404).json({ message: "Branch not found" });
        }

        product.branchId = branchId;
      }

      // Update product properties
      if (productName) product.productName = productName;
      if (description !== undefined) product.description = description;
      if (category) product.category = category as ProductCategory;
      if (initialQuantity !== undefined)
        product.initialQuantity = initialQuantity;
      if (imageSrc !== undefined) product.imageSrc = imageSrc;

      // Validate updated product
      const errors = await validate(product);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await productRepository.save(product);

      return res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Delete product
  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id },
        relations: ["logs"],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if the product has associated logs
      if (product.logs && product.logs.length > 0) {
        return res.status(400).json({
          message:
            "Cannot delete product with associated logs. Consider archiving instead.",
        });
      }

      await productRepository.delete(id);

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
