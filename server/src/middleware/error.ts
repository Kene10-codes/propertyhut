import { Response, Request, NextFunction } from "express";

function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.log(err);
  res.status(err.status || 500).json({
    err: err.message || "Internal server error",
  });
}

export { errorHandler };
