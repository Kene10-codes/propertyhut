import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.js";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.auth?.role !== "admin") {
    errorResponse(res, "Admin access required", 403);
    return;
  }

  next();
};
