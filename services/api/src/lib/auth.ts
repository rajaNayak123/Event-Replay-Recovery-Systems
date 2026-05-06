import { jwtVerify } from "jose";
import { Request } from "express";
import { ApiError } from "./api-error";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET
);

export async function verifyToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required: Missing or invalid Authorization header");
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, SECRET);
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    throw new ApiError(401, "Authentication failed: Token is invalid or expired");
  }
}
