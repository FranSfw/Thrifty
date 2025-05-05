import { Router, Request, Response, NextFunction } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();

// Helper to wrap the controller functions
const asyncHandler = (
  fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// GET /api/Products - Obtener todos los productos
router.get("/", asyncHandler(ProductController.getAllProducts));

// POST /api/Products - Crear un nuevo producto
router.post("/", asyncHandler(ProductController.createProduct));

// GET /api/Products/{id} - Obtener un producto por su ID
router.get("/:id", asyncHandler(ProductController.getProductById));

// PUT /api/Products/{id} - Actualizar un producto existente
router.put("/:id", asyncHandler(ProductController.updateProduct));

// DELETE /api/Products/{id} - Eliminar un producto
router.delete("/:id", asyncHandler(ProductController.deleteProduct));

// GET /api/Products/Branch/{branchId} - Obtener productos de una sucursal específica
router.get(
  "/Branch/:branchId",
  asyncHandler(ProductController.getProductsByBranchId)
);

export default router;
