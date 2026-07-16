import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { register, login, getProfile, updateProfile } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middleware/validate";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);

export default router;
