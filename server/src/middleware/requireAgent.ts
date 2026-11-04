import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.js";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.auth?.role !== "agent") {
    errorResponse(res, "Agent access required", 403)
    return;  
}

  next();
};