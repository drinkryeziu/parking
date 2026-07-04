import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import paymentRoutes from "./routes/payments";
import profileRoutes from "./routes/profile";

const app = express();

// Allow localhost (dev), any explicitly configured CLIENT_URL(s),
// and any *.vercel.app deployment so the frontend keeps working
// even when Vercel changes the preview/production URL.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser requests (curl, health checks) have no origin.
      if (!origin) return callback(null, true);
      if (
        origin.startsWith("http://localhost") ||
        origin.endsWith(".vercel.app") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// TEMP diagnostic: list actual columns on the User table
app.get("/api/debug/columns", async (_req, res) => {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const p = new PrismaClient();
    const rows = await p.$queryRawUnsafe(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'User' ORDER BY column_name`
    );
    res.json({ columns: rows });
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
