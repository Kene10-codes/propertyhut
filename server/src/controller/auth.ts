import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { User } from "../model/User.js";
import { token } from "../utils/token.js";
import { env } from "../config/env.js";
import { successResponse, errorResponse } from "../utils/response.js";

async function login(req: Request, res: Response) {
  // Destructure the request body
  const { email, password } = req.body;

  // Check if email exists already or not
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
     errorResponse(res, "Invalid email or password", 400);
      return;
  }

  if (user?.status === "pending") {
    errorResponse(res, "You cannot log in now, waiting for admin approval", 400);
    return;
  }

  if (user?.status === "rejected") {
    errorResponse(res, "Your request was rejected!, try again", 403)
    return;
  }

  // Generate token
  const generatedToken = token(user);

   successResponse(res, "Logged in successfully", 200, generatedToken);
}

async function signup(req: Request, res: Response) {
  const { firstName, lastName, email, role, password, phone } = req.body;

  // Check if email exists already
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    errorResponse(res, "Email exists already!", 409);
    return;
  }

  // Check Phone exists
  const existingPhone = await User.findOne({ phone });

  if (existingPhone) {
    errorResponse(res, "Phone number exists already!", 409);
    return;
  }

  // Generate salt Password
  const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  const status = role === "agent" ? "pending" : "approved";

  const user = await User.create({
    firstName,
    lastName,
    email,
    status,
    phone,
    role,
    password: hashedPassword,
  });

  const message =
    status === "pending"
      ? "Kndly wait for admin to approve"
      : "User registered succesfully";

  successResponse(res, message, 201, {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  });
}

// ME/USER CONTROLLER
async function Profile(req: Request, res: Response) {
  const user = req.auth;

  if (!user) {
    errorResponse(res, "User not found", 404);
    return;
  }

  // FINMD USER BY ID
  const foundUser = await User.findById(user.id).select("-password");

  if (!foundUser) {
    errorResponse(res, "User not found", 404);
    return;
  }

  successResponse(res, "User found", 200, {
    id: foundUser._id.toString(),
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    email: foundUser.email,
    status: foundUser.status,
    phone: foundUser.phone
  });
}

export { login, signup, Profile };