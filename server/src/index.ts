import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import paymentRoutes from "./routes/payments";

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

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
