import { jwtVerify } from "jose";
import { Request } from "express";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "6oSPg1sEJiVZjtPmzsOeSgwtOW1QpPbR/5cpyCxqQWoH"
);

export async function verifyToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
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
    // If verification fails, it might be because the token is encrypted (JWE) 
    // or just invalid. For now, we return null as requested.
    return null;
  }
}
