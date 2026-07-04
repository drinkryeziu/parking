import { Request } from "express";
import jwt from "jsonwebtoken";

// Extract the authenticated user's id from the Bearer token, or null.
export function getUserId(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const payload = jwt.verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET!) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}
