// @ts-ignore jsonwebtoken is installed without its declaration package.
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
// @ts-ignore jsonwebtoken is installed without its declaration package.
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

type Role = "user" | "admin" | "agent";
type Status = "approved" | "pending" | "rejected";

export interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  status: Status;
  createdAt: Date;
}

// GENERATE ACCESS TOKEN
export function generateAccessToken(user: User): string {
  const secret = env.ACCESS_TOKEN_SECRET;
  const expiresIn = env.ACCESS_TOKEN_EXPIRES;

  if (!secret || !expiresIn) {
    throw new Error("Access token secret and expiration must be configured");
  }

  return jwt.sign(
    {
      id: user.id.toString(),
      role: user.role,
    },
    secret,
    { expiresIn: expiresIn as SignOptions["expiresIn"] },
  );
}

// Generates a secure random refresh token
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

// Generates a hash of the refresh token for secure storage
export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// GENERATE PASSWORD RESET TOKEN
export function generatePasswordResetToken() {
  const resetToken = crypto.randomBytes(64).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedToken };
}
