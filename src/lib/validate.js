import { z } from "zod";

export const createBookingSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(9).max(20),
  service: z.string().min(2).max(20), // service code, e.g., "classic"
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  time: z.string().regex(/^\d{2}:\d{2}$/)        // HH:mm (24h)
});
