import { Router } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create a Stripe PaymentIntent — card data never touches our server
router.post("/create-intent", async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) return res.status(400).json({ error: "bookingId required" });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const intent = await stripe.paymentIntents.create({
    amount: booking.totalAmount,
    currency: "usd",
    metadata: { bookingId },
  });

  res.json({ clientSecret: intent.client_secret });
});

// Stripe webhook — marks booking as paid after Stripe confirms
router.post("/webhook", express_raw(), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return res.status(400).send("Webhook signature invalid");
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const bookingId = intent.metadata.bookingId;
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "paid", stripePaymentIntentId: intent.id },
      });
    }
  }

  res.json({ received: true });
});

function express_raw() {
  const express = require("express");
  return express.raw({ type: "application/json" });
}

export default router;
