import { Router, Request, Response, NextFunction } from "express";
import { BranchController } from "../controllers/branch.controller";

const router = Router();

// Helper to wrap the controller functions
const asyncHandler = (
  fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// GET /api/Branches - Obtener todas las sucursales
router.get("/", asyncHandler(BranchController.getAllBranches));

// POST /api/Branches - Crear una nueva sucursal
router.post("/", asyncHandler(BranchController.createBranch));

// GET /api/Branches/{id} - Obtener una sucursal por su ID
router.get("/:id", asyncHandler(BranchController.getBranchById));

// PUT /api/Branches/{id} - Actualizar una sucursal existente
router.put("/:id", asyncHandler(BranchController.updateBranch));

// DELETE /api/Branches/{id} - Eliminar una sucursal
router.delete("/:id", asyncHandler(BranchController.deleteBranch));

export default router;
