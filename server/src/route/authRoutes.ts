import express from "express";
import { login, logout, Profile, refresh, signup } from "../controller/auth.js";
import { loginValidation, signupValidation } from "../validation/index.js";
import { authorize} from "../middleware/requireAuth.js";
import { authenticate } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/refresh", authenticate, refresh);
router.post("/logout", authenticate, logout);

router.get("/profile", authenticate, authorize("admin", "user"), Profile);

export default router;