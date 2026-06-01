import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.js";
import { validateRegister, validateLogin } from "../validators/auth.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
