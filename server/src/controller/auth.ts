import bcrypt from "bcryptjs";
import crypto from "crypto";
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
import { generatePasswordResetToken } from "../utils/generateToken.js";
import { sendEmail } from "../service/emailService.js";


// LOGIN CONTROLLER
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

    if (!user.isEmailVerified) {
      errorResponse(res, "Please verify email address", 403);
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

// SIGNUP CONTROLLER
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

    // Generate verification token.
    const { resetToken, hashedToken } = generatePasswordResetToken();

    const user = await User.create({
      firstName,
      lastName,
      email,
      status,
      phone,
      role,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    const verificationURL = `${env.CLIENT_URL}/verify-email/${resetToken}`;

    const emailVerificationMessage = `
      <h2>Welcome, ${user.firstName}</h2>

      <p>Thank you for creating an account.</p>

      <p>Please verify your email address by clicking below:</p>

      <a href="${verificationURL}">
        Verify Email Address
      </a>

      <p>This link expires in 15 minutes.</p>

      <p>If you did not create this account, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Verify Your Email Address",
        emailVerificationMessage,
      });
    } catch (emailError) {
      successResponse(
        res,
        "Account created, but verification email could not be sent. Please request another verification email.",
        201,
        {
          success: true,
        },
      );
      return;
    }
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

// REFRESH TOKEN CONTROLLER
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

//VERIFY EMAIL
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const tokenParam = req.params.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find and consume the token in one database operation.
    const user = await User.findOneAndUpdate(
      {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: {
          $gt: new Date(),
        },
        isEmailVerified: false,
      },
      {
        $set: {
          isEmailVerified: true,
        },
        $unset: {
          emailVerificationToken: 1,
          emailVerificationExpires: 1,
        },
      },
      {
        new: true,
      },
    );

    if (!user) {
      errorResponse(res, "Invalid or expired verification link.", 400);
      return;
    }

    successResponse(
      res,
      "Email verified successfully. You can now log in.",
      200,
      {
        success: true,
      },
    );
    return;
  } catch (error) {
    errorResponse(res, "Unable to verify email. Please try again.", 500);
    return;
  }
};

// RESEND VERIFICATION EMAIL
const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      errorResponse(res, "Please provide an email address", 400);
      return;
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      isEmailVerified: false,
    });

    const response = {
      success: true,
      message:
        "If an unverified account exists, a verification email will be sent.",
    };

    if (!user) {
      return res.status(200).json(response);
    }

    const { resetToken, hashedToken } = generatePasswordResetToken();

    user.emailVerificationToken = hashedToken;

    user.emailVerificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${resetToken}`;

    const emailVerificationMessage = `
      <h2>Verify Your Email</h2>

      <p>Please click the link below to verify your account.</p>

      <a href="${verificationURL}">
        Verify Email
      </a>

      <p>This link expires in 15 minutes.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification",
        emailVerificationMessage,
      });
    } catch (emailError) {
      (user as any).emailVerificationToken = undefined;
      (user as any).emailVerificationExpires = undefined;

      await user.save();

      throw emailError;
    }

    return res.status(200).json(response);
  } catch (error) {
    errorResponse(res, "Unable to send verification email.", 500);
    return;
  }
};


// FORGOTTEN PASSWORD
const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Use the same response whether the account exists or not.
    const response = {
      success: true,
      message:
        "If an account exists with this email, a password reset link will be sent.",
    };

    if (!user) {
      return res.status(200).json(response);
    }

    const { resetToken, hashedToken } = generatePasswordResetToken();

    user.resetPasswordToken = hashedToken;

    user.resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const emailVerificationMessage = `
      <h2>Password Reset Request</h2>

      <p>You requested to reset your password.</p>

      <p>Click the link below to create a new password:</p>

      <a href="${resetURL}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>

      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        emailVerificationMessage,
      });
    } catch (emailError) {
      // Do not leave a valid token when email delivery fails.
      (user as any).resetPasswordToken = undefined;
      (user as any).resetPasswordTokenExpires = undefined;

      await user.save();

      throw emailError;
    }

    return res.status(200).json(response);
  } catch (error) {
    errorResponse(
      res,
      "Unable to process your request. Please try again.",
      500,
    );
    return;
  }
};


// RESET PASSWORD CONTROLLER
const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const tokenParams  = req.params;
    const { password } = req.body;

    const token = tokenParams ? tokenParams[0] : tokenParams;

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      errorResponse(res, "Invalid or expired password reset link.", 400 );
      return;
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      errorResponse(res, "Password must be at least 8 characters.", 400);
      return;
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      errorResponse(res, "Invalid or expired password reset link." , 400);
      return;
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    user.password = hashedPassword;

    // Invalidate the token after successful use.
    (user as any).resetPasswordToken = undefined;
    (user as any).resetPasswordExpires = undefined;

    await user.save();

    successResponse(res, "Password reset successful. Please log in.", 200, { success: true } );
    return;
  } catch (error) {
    errorResponse(res, "Unable to reset password. Please try again.", 500 )
    return;
  }
};

// EXPORT CONTROLLER FUNCTIONS
export {
  login,
  signup,
  Profile,
  refresh,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
  resendVerificationEmail,
};
