import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Branch } from "../entities/branch";

export class BranchController {
  // Get all branches
  static getAllBranches = async (req: Request, res: Response) => {
    try {
      const branchRepository = AppDataSource.getRepository(Branch);
      const branches = await branchRepository.find({ relations: ["products"] });

      return res.status(200).json(branches);
    } catch (error) {
      console.error("Error getting branches:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get one branch by id
  static getBranchById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid branch ID" });
      }

      const branchRepository = AppDataSource.getRepository(Branch);
      const branch = await branchRepository.findOne({
        where: { id },
        relations: ["products"],
      });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      return res.status(200).json(branch);
    } catch (error) {
      console.error("Error getting branch:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Create a new branch
  static createBranch = async (req: Request, res: Response) => {
    try {
      const { branchName, address } = req.body;

      if (!branchName || !address) {
        return res
          .status(400)
          .json({ message: "Branch name and address are required" });
      }

      const branch = new Branch();
      branch.branchName = branchName;
      branch.address = address;

      // Validate branch entity
      const errors = await validate(branch);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const branchRepository = AppDataSource.getRepository(Branch);
      await branchRepository.save(branch);

      return res.status(201).json({
        message: "Branch created successfully",
        branch,
      });
    } catch (error) {
      console.error("Error creating branch:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update branch
  static updateBranch = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid branch ID" });
      }

      const { branchName, address } = req.body;

      const branchRepository = AppDataSource.getRepository(Branch);
      const branch = await branchRepository.findOne({ where: { id } });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      // Update branch properties
      if (branchName) branch.branchName = branchName;
      if (address) branch.address = address;

      // Validate updated branch
      const errors = await validate(branch);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await branchRepository.save(branch);

      return res.status(200).json({
        message: "Branch updated successfully",
        branch,
      });
    } catch (error) {
      console.error("Error updating branch:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Delete branch
  static deleteBranch = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid branch ID" });
      }

      const branchRepository = AppDataSource.getRepository(Branch);
      const branch = await branchRepository.findOne({
        where: { id },
        relations: ["products"],
      });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      // Check if the branch has associated products
      if (branch.products && branch.products.length > 0) {
        return res.status(400).json({
          message:
            "Cannot delete branch with associated products. Remove products first.",
        });
      }

      await branchRepository.delete(id);

      return res.status(200).json({ message: "Branch deleted successfully" });
    } catch (error) {
      console.error("Error deleting branch:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
