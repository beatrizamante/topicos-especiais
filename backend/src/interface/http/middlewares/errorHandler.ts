import { Request, Response, NextFunction } from "express";
import { BaseError, ERROR_CODES } from "../../../domain/applicationErrors";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof BaseError) {
    res.status(getStatusCode(error.code)).json({
      error: error.message,
      code: error.code,
    });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    code: ERROR_CODES.INTERNAL_SERVICE_ERROR,
  });
}

function getStatusCode(code: string): number {
  switch (code) {
    case ERROR_CODES.INVALID_FICTION_ERROR:
      return 400;
    case ERROR_CODES.INVALID_USER_ERROR:
      return 400;
    case ERROR_CODES.UNAUTHENTICATED_ERROR:
      return 401;
    case ERROR_CODES.UNAUTHORIZED_ERROR:
      return 403;
    case ERROR_CODES.EXTERNAL_SERVICE_ERROR:
      return 503;
    default:
      return 500;
  }
}
