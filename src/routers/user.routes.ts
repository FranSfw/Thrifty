import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

// Helper to wrap the controller functions
const asyncHandler = (
  fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// GET /api/Users - Obtener todos los usuarios
router.get("/", asyncHandler(UserController.getAllUsers));

// POST /api/Users - Crear un nuevo usuario
router.post("/", asyncHandler(UserController.createUser));

// GET /api/Users/{id} - Obtener un usuario por su ID
router.get("/:id", asyncHandler(UserController.getUserById));

// PUT /api/Users/{id} - Actualizar un usuario existente
router.put("/:id", asyncHandler(UserController.updateUser));

// DELETE /api/Users/{id} - Eliminar un usuario
router.delete("/:id", asyncHandler(UserController.deleteUser));

export default router;
