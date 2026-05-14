import { createReview, deleteReview, getProductReviews } from "../controllers/review.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { Router } from "express"

const router = Router()

router.post("/", authenticate, createReview)
router.get("/:productId", getProductReviews)
router.delete("/:id", requireAdmin, deleteReview)

export default router;