import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { User } from "../entities/user";
import * as bcrypt from "bcrypt";

export class UserController {
  // Get all users
  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        select: ["id", "name", "email", "role"], // Exclude password from response
        relations: ["logs"],
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get user by id
  static getUserById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id },
        select: ["id", "name", "email", "role"], // Exclude password from response
        relations: ["logs"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Create a new user
  static createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          message: "Name, email, password and role are required",
        });
      }

      // Check if user with email already exists
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const user = new User();
      user.name = name;
      user.email = email;

      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      user.role = role;

      // Validate user entity
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await userRepository.save(user);

      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update user
  static updateUser = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { name, email, password, role } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if email is being changed and if it's already in use by another user
      if (email && email !== user.email) {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = email;
      }

      // Update user properties
      if (name) user.name = name;
      if (role) user.role = role;

      // If password is being updated, hash it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      // Validate updated user
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      await userRepository.save(user);

      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "User updated successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Delete user
  static deleteUser = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id },
        relations: ["logs"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user has associated logs
      if (user.logs && user.logs.length > 0) {
        return res.status(400).json({
          message:
            "Cannot delete user with associated logs. Consider deactivating instead.",
        });
      }

      await userRepository.delete(id);

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
