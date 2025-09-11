import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { servicesRouter } from "./routes/services.js";
import { bookingsRouter } from "./routes/bookings.js";
import { authRouter } from "./routes/auth.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const origins = (process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: origins.length ? origins : true,
  methods: ["GET", "POST", "OPTIONS"]
}));

app.use("/health", (_req, res) => res.json({ ok: true }));

// Basic rate limit (tune as needed)
app.use("/api/", rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false }));

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/auth", authRouter);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`✅ Campus Nails API running on http://localhost:${PORT}`);
});
