import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const servicesRouter = Router();

// List services (for frontend dropdowns or price displays)
servicesRouter.get("/", async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { priceKES: "asc" },
      select: { id: true, code: true, name: true, description: true, priceKES: true }
    });
    res.json(services);
  } catch (e) { next(e); }
});
