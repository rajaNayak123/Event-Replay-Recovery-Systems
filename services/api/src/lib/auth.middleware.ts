import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./api-error";

interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new ApiError(401, "Authentication required"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new ApiError(401, "Authentication required"));
    }

    const secret = process.env.AUTH_SECRET;

    if (!secret) {
      console.error("AUTH_SECRET is not defined in environment");
      return next(new ApiError(500, "Server configuration error"));
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    req.user = {
      id: (decoded.id as string) || (decoded.sub as string),
      name: decoded.name as string | undefined,
      email: decoded.email as string | undefined,
      role: (decoded.role as string) || "VIEWER",
    };

    next();
  } catch (error) {

    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError
    ) {
      return next(new ApiError(401, "Invalid or expired token"));
    }
    next(error);
  }
};
