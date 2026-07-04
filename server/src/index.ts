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

// TEMP diagnostic: does the Prisma client know the new columns?
app.get("/api/debug/columns", async (_req, res) => {
  const { PrismaClient } = await import("@prisma/client");
  const p = new PrismaClient();
  const out: any = {};
  try {
    out.dbColumns = await p.$queryRawUnsafe(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'User' ORDER BY column_name`
    );
  } catch (e: any) { out.dbColumnsError = String(e?.message || e); }
  try {
    // Attempt the write that crashes in production, but catch the real error.
    const anyUser = await p.user.findFirst();
    if (anyUser) {
      await p.user.update({ where: { id: anyUser.id }, data: { companyName: anyUser.companyName ?? "" } });
      out.updateCompanyName = "OK — client knows the column";
    } else {
      out.updateCompanyName = "no users to test";
    }
  } catch (e: any) {
    out.updateCompanyName = "FAILED: " + String(e?.message || e).slice(0, 300);
  }
  res.json(out);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
