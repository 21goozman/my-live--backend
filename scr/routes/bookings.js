import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createBookingSchema } from "../lib/validate.js";
import { combineLocalDateTimeToUTC, normalizeKenyanPhone, TZ } from "../lib/util.js";
import { sendEmail } from "../lib/mailer.js";
import { sendSMS } from "../lib/sms.js";

export const bookingsRouter = Router();

// Allowed status values for SQLite (since enums are not supported)
const ALLOWED_STATUSES = ["CONFIRMED", "CANCELED"];

// -------------------- CREATE BOOKING --------------------
bookingsRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createBookingSchema.parse(req.body);
    const phone = normalizeKenyanPhone(parsed.phone);
    if (!phone) return res.status(400).json({ error: "Invalid Kenyan phone. Use 07xx xxx xxx or +2547…" });

    const svc = await prisma.service.findUnique({ where: { code: parsed.service } });
    if (!svc) return res.status(400).json({ error: "Unknown service." });

    const { local, utcISO } = combineLocalDateTimeToUTC(parsed.date, parsed.time, TZ);

    // Reject past times
    const nowTZ = new Date();
    if (local.toJSDate() <= nowTZ) {
      return res.status(400).json({ error: "Please choose a time in the future." });
    }

    // Prevent double-booking
    const conflict = await prisma.booking.findUnique({ where: { startUTC: new Date(utcISO) } });
    if (conflict) return res.status(409).json({ error: "That time slot is already taken. Pick another time." });

    const created = await prisma.booking.create({
      data: {
        name: parsed.name.trim(),
        phone,
        serviceId: svc.id,
        startUTC: new Date(utcISO),
        tz: TZ,
        status: "CONFIRMED" // default for SQLite
      },
      include: { service: true }
    });

    const prettyDate = local.toFormat("cccc, dd LLL yyyy");
    const prettyTime = local.toFormat("HH:mm");
    const human = `Hey ${created.name}, your ${created.service.name} is booked for ${prettyDate} at ${prettyTime} (${TZ}). 💅`;

    // Notifications (optional)
    sendEmail({
      to: "client@example.com", // replace if collecting email
      subject: "Campus Nails Booking Confirmation",
      text: human,
      html: `<p>${human}</p>`
    }).catch(() => {});
    sendSMS(created.phone, human).catch(() => {});

    res.status(201).json({
      id: created.id,
      name: created.name,
      phone: created.phone,
      service: {
        code: created.service.code,
        name: created.service.name,
        priceKES: created.service.priceKES
      },
      when: { local: local.toISO(), tz: TZ },
      status: created.status,
      message: human
    });
  } catch (e) {
    if (e?.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input.", details: e.issues });
    }
    next(e);
  }
});

// -------------------- LIST BOOKINGS --------------------
bookingsRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.booking.findMany({
      orderBy: { startUTC: "asc" },
      include: { service: true }
    });
    res.json(items.map(b => ({
      id: b.id,
      name: b.name,
      phone: b.phone,
      service: { code: b.service.code, name: b.service.name, priceKES: b.service.priceKES },
      startUTC: b.startUTC,
      tz: b.tz,
      status: ALLOWED_STATUSES.includes(b.status) ? b.status : "UNKNOWN"
    })));
  } catch (e) { next(e); }
});

// -------------------- UPDATE STATUS --------------------
// Example: cancel a booking
bookingsRouter.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ id: updated.id, status: updated.status });
  } catch (e) { next(e); }
});
