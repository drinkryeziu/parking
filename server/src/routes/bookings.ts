import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

function getUserId(req: any): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const payload = jwt.verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET!) as any;
    return payload.userId;
  } catch {
    return null;
  }
}

router.post("/", async (req, res) => {
  const {
    firstName, lastName, phone, email, companyName,
    trailerType, trailerNumber, licensePlate,
    startDate, endDate, totalAmount,
    paymentMethod, smsConfirmation, emailInvoice,
  } = req.body;

  if (!firstName || !lastName || !phone || !email || !companyName ||
      !trailerType || !trailerNumber || !licensePlate ||
      !startDate || !endDate || !totalAmount || !paymentMethod) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const userId = getUserId(req);

  const booking = await prisma.booking.create({
    data: {
      userId,
      firstName, lastName, phone, email, companyName,
      trailerType, trailerNumber, licensePlate,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalAmount: Math.round(totalAmount * 100), // store in cents
      paymentMethod,
      smsConfirmation: smsConfirmation ?? true,
      emailInvoice: emailInvoice ?? true,
    },
  });

  res.json({ bookingId: booking.id });
});

router.get("/:id", async (req, res) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) return res.status(404).json({ error: "Not found" });
  res.json(booking);
});

export default router;
