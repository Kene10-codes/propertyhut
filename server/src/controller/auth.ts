import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { User } from "../model/User.js";
import { env } from "../config/env.js";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  createSession,
  revokeRefreshToken,
  rotateRefreshToken,
} from "../service/authService.js";
import { refreshCookieOptions } from "../utils/cookieOptions.js";

async function login(req: Request, res: Response) {
  try {
    // Destructure the request body
    const { email, password } = req.body;

    // Check if email exists already or not
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      errorResponse(res, "Invalid email or password", 400);
      return;
    }
    if (user?.status === "pending") {
      errorResponse(
        res,
        "You cannot log in now, waiting for admin approval",
        400,
      );
      return;
    }

    if (user?.status === "rejected") {
      errorResponse(res, "Your request was rejected!, try again", 403);
      return;
    }

    const tokens = await createSession(user);

    res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

    successResponse(res, "Logged in successfully", 200, {
      accessToken: tokens.accessToken,
      id: user._id.toString(),
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    errorResponse(res, "Login failed", 500);
  }
}

async function signup(req: Request, res: Response) {
  try {
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
      role: user.role,
    });
  } catch (error) {
    errorResponse(res, "Signup failed", 500);
  }
}

// ME/USER CONTROLLER
async function Profile(req: Request, res: Response) {
  try {
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
      phone: foundUser.phone,
    });
  } catch (error) {
    errorResponse(res, "Profile was not retreieved successfully", 500);
  }
}

// REFRESH TOKEN
async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      errorResponse(res, "Refresh token not found", 401);
      return;
    }

    const tokens = await rotateRefreshToken(token);

    res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

    successResponse(res, "Token refreshed successfully", 200, {
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    res.clearCookie("refreshToken", {
      ...refreshCookieOptions,
      maxAge: undefined,
    });

    const message = error instanceof Error ? error.message : "";

    if (
      message === "INVALID_REFRESH_TOKEN" ||
      message === "EXPIRED_REFRESH_TOKEN" ||
      message === "REFRESH_TOKEN_REUSE"
    ) {
      errorResponse(res, "Session expired. Please log in again.", 401);
      return;
    }
    errorResponse(res, "Could not refresh session", 500);
  }
}

// LOGOUT CONTROLLER
async function logout(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await revokeRefreshToken(token);
    }

    res.clearCookie("refreshToken", {
      ...refreshCookieOptions,
      maxAge: undefined,
    });

    successResponse(res, "Logged out successfully", 200, null);
  } catch (error) {
    errorResponse(res, "Logout failed", 500);
  }
}

export { login, signup, Profile, refresh, logout };
