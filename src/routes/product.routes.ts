import { createProduct, deleteProduct, getFeaturedProducts, getProductById, getProductBySlug, getProducts, updateProduct } from "../controllers/product.controller";
import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router()


router.get("/", getProducts)
router.get("/slug/:slug", getProductBySlug)
router.get("/featured", getFeaturedProducts)
router.get("/:id",getProductById)
router.post("/", authenticate, requireAdmin, createProduct)
router.put("/:id", authenticate, requireAdmin, updateProduct)
router.delete("/:id", authenticate, requireAdmin, deleteProduct)


export default router