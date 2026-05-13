import { Router } from "express"
import { authenticate, requireAdmin } from "../middleware/auth"
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controller"


const router = Router()


router.get("/", getCategories)
router.get("/:id",getCategoryById)
router.post("/", authenticate, requireAdmin, createCategory)
router.put("/:id", authenticate, requireAdmin, updateCategory)
router.delete("/:id", authenticate, requireAdmin, deleteCategory)


export default router