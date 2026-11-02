import { Response } from "express";

function successResponse(
  res: Response,
  message: string,
  statusCode = 200,
  data: any
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(
  res: Response,
  message: string,
  statusCode = 500,
  errorCode = null,
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorCode ? { code: errorCode } : undefined,
  });
}

export { successResponse, errorResponse };
