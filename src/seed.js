import { prisma } from "./lib/prisma.js";

async function main() {
  // idempotent upsert by code
  await prisma.service.upsert({
    where: { code: "classic" },
    update: {},
    create: {
      code: "classic",
      name: "Classic Polish",
      description: "Simple, sleek, and affordable. Perfect for lectures & casual hangouts.",
      priceKES: 300
    }
  });

  await prisma.service.upsert({
    where: { code: "gel" },
    update: {},
    create: {
      code: "gel",
      name: "Gel Polish",
      description: "Long-lasting shine for that campus queen vibe ✨",
      priceKES: 500
    }
  });

  await prisma.service.upsert({
    where: { code: "art" },
    update: {},
    create: {
      code: "art",
      name: "Nail Art",
      description: "Custom designs to stand out at parties & events.",
      priceKES: 700
    }
  });

  console.log("🌱 Seeded services");
}

main().finally(async () => { await prisma.$disconnect(); });
