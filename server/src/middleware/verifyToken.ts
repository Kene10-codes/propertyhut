import { NextFunction, Request, Response } from "express";
// @ts-ignore
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type Role = "user" | "agent" | "admin";

interface AuthPayload {
  id: string;
  role: Role;
}

function isRole(value: unknown): value is Role {
  return value === "user" || value === "agent" || value === "admin";
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication is required",
    });
  }

  const token = authHeader?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      !isRole(decoded.role)
    ) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    req.auth = {
      id: decoded.id,
      role: decoded.role,
    };
    return next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError
    ) {
      return res
        .status(401)
        .json({ error: "Invalid or expired authentication token" });
    }

    return next(error);
  }
}

export { verifyToken };
