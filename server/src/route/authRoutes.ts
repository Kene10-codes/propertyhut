import express from "express";
import { login, Profile, signup } from "../controller/auth.js";
import { loginValidation, signupValidation } from "../validation/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
//router.post("/refresh");

//router.post("/logout");

router.get("/profile", requireAdmin, Profile);

export default router;