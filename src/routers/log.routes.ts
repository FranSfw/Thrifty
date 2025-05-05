import { Router, Request, Response, NextFunction } from "express";
import { LogController } from "../controllers/log.controller";

const router = Router();

// Helper to wrap the controller functions
const asyncHandler = (
  fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// GET /api/Logs - Obtener todos los registros de logs
router.get("/", asyncHandler(LogController.getAllLogs));

// POST /api/Logs - Crear un nuevo registro de log
router.post("/", asyncHandler(LogController.createLog));

// GET /api/Logs/{id} - Obtener un log por su ID
router.get("/:id", asyncHandler(LogController.getLogById));

// GET /api/Logs/Product/{productId} - Obtener logs de un producto específico
router.get(
  "/Product/:productId",
  asyncHandler(LogController.getLogsByProductId)
);

export default router;
