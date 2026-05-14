import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/order.controller"
import { Router } from "express"
import { authenticate, requireAdmin } from "../middleware/auth"

const router = Router()


router.post("/", authenticate, createOrder)
router.get("/my-orders", authenticate, getMyOrders
)
router.get("/:id", authenticate, getOrderById)
router.get("/", authenticate, requireAdmin, getAllOrders)
router.patch("/:id", authenticate, requireAdmin, updateOrderStatus)

export default router;