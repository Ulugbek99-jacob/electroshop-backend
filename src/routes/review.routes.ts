import { Router } from "express";
import { createReview, deleteReview, getProductReviews } from "../controllers/review.controller";
import { authenticate } from "../middleware/auth";
import { validateReview } from "../middleware/validate";

const router = Router();

router.post("/", authenticate, validateReview, createReview);
router.get("/:productId", getProductReviews);
router.delete("/:id", authenticate, deleteReview);

export default router;
