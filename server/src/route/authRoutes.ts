import express from "express";
import { login, signup } from "../controller/auth.js";
import { loginValidation, signupValidation } from "../validation/index.js";

const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

export default router;