import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getUserId } from "../auth-middleware";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
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

  // For logged-in drivers, remember their trailer/company details so the
  // next booking is pre-filled (captured from first booking).
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { phone, companyName, trailerType, trailerNumber, licensePlate },
    }).catch(() => { /* non-fatal: booking already saved */ });
  }

  res.json({ bookingId: booking.id });
});

router.get("/:id", async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) return res.status(404).json({ error: "Not found" });
  res.json(booking);
});

export default router;
