import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getUserId } from "../auth-middleware";

const router = Router();
const prisma = new PrismaClient();

function publicProfile(u: {
  firstName: string; lastName: string; email: string;
  phone: string | null; companyName: string | null;
  trailerType: string | null; trailerNumber: string | null; licensePlate: string | null;
}) {
  return {
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone ?? "",
    companyName: u.companyName ?? "",
    trailerType: u.trailerType ?? "",
    trailerNumber: u.trailerNumber ?? "",
    licensePlate: u.licensePlate ?? "",
  };
}

// GET current user's profile
router.get("/", async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(publicProfile(user));
});

// Update current user's saved profile / trailer details
router.put("/", async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  const { firstName, lastName, phone, companyName, trailerType, trailerNumber, licensePlate } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(firstName !== undefined ? { firstName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(companyName !== undefined ? { companyName } : {}),
      ...(trailerType !== undefined ? { trailerType } : {}),
      ...(trailerNumber !== undefined ? { trailerNumber } : {}),
      ...(licensePlate !== undefined ? { licensePlate } : {}),
    },
  });

  res.json(publicProfile(user));
});

export default router;
