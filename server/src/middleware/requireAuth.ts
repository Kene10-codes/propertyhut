import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.js";
import type { UserRole } from "../types/index.js";


export const authorize = (...allowedRoles: UserRole[]) => {
   return (
    req: Request,
    res: Response,
    next: NextFunction
   ) => {
    const role = req.auth?.role as UserRole | undefined;

    if (!role) {
       errorResponse(res, "Authentication required", 401);
       return;
    }

    if (!allowedRoles.includes(role)) {
      errorResponse(res, "You do not have permission to access this resource", 403);
      return;
    }

    next();
   }

}  