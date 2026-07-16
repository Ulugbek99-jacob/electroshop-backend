import { Router } from "express";
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/order.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validateOrder } from "../middleware/validate";

const router = Router();

router.post("/", authenticate, validateOrder, createOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/", authenticate, requireAdmin, getAllOrders);
router.get("/:id", authenticate, getOrderById);
router.patch("/:id", authenticate, requireAdmin, updateOrderStatus);

export default router;
