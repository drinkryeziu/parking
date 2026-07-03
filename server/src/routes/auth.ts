import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();

function makeToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "30d" });
}

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { email, firstName, lastName, phone, password } = req.body;
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ error: "email, firstName, lastName and password are required" });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "An account with this email already exists" });

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, firstName, lastName, phone, password: hash },
  });
  const token = makeToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return res.status(401).json({ error: "Invalid email or password" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  const token = makeToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
});

// Google OAuth via access token (from useGoogleLogin)
router.post("/google-access-token", async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "accessToken required" });

  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    if (!response.ok) return res.status(401).json({ error: "Invalid Google token" });
    const profile = await response.json() as { id: string; email: string; given_name?: string; family_name?: string };

    const { id: googleId, email, given_name: firstName = "", family_name: lastName = "" } = profile;

    let user = await prisma.user.findFirst({ where: { OR: [{ googleId }, { email }] } });
    if (!user) {
      user = await prisma.user.create({ data: { email, firstName, lastName, googleId } });
    } else if (!user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId } });
    }

    const token = makeToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch {
    res.status(401).json({ error: "Google authentication failed" });
  }
});

export default router;
