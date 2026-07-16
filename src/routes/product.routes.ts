import { Router } from "express";
import {
  createProduct, deleteProduct, getFeaturedProducts,
  getProductById, getProductBySlug, getProducts, updateProduct,
} from "../controllers/product.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validateProduct } from "../middleware/validate";

const router = Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);
router.post("/", authenticate, requireAdmin, validateProduct, createProduct);
router.put("/:id", authenticate, requireAdmin, updateProduct);
router.delete("/:id", authenticate, requireAdmin, deleteProduct);

export default router;
