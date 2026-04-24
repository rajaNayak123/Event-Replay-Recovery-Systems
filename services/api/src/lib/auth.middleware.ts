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

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.error("AUTH_SECRET is not defined");
    throw new ApiError(500, "Server configuration error");
  }

  try {
    const decoded = jwt.verify(token, secret) as any;
    
    req.user = {
      id: decoded.id || decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || "VIEWER",
    };

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};
