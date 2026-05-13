import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { register, login, getProfile } from "../controllers/auth.controller";


const router = Router();

router.post("/register", register)
router.post("/login", login)
router.get("/me", authenticate, getProfile)

export default router;