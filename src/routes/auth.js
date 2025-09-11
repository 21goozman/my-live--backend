// routes/auth.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const authRouter = Router();

// --- Helpers ---
const normalizePhone = phone => phone ? phone.replace(/\D/g, "") : null;
const normalizeEmail = email => email ? email.trim().toLowerCase() : null;

// --- Admin definitions (normalized) ---
const ADMIN_PHONE = normalizePhone("+254790929839");
const ADMIN_EMAIL = normalizeEmail("jessecliff08@gmail.com");

/*// --- Register ---
authRouter.post("/register", async (req, res) => {
  const { phone, email, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: "Phone and password are required." });
  }

  try {
    const inputPhone = normalizePhone(phone);
    const inputEmail = normalizeEmail(email);

    const existing = await prisma.user.findUnique({ where: { phone: inputPhone } });
    if (existing) {
      return res.status(409).json({ error: "Phone already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin = inputPhone === ADMIN_PHONE || inputEmail === ADMIN_EMAIL;

    await prisma.user.create({
      data: {
        phone: inputPhone,
        email: inputEmail,
        password: hashedPassword,
        isAdmin,
      },
    });

    res.status(201).json({ message: "Registered successfully." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed." });
  }
});*/

/*// --- Login ---
authRouter.post("/login", async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json({ success: false, error: "Email or phone and password are required." });
  }

  try {
    let user = null;

    if (email) {
      const normalizedEmail = normalizeEmail(email);
      if (normalizedEmail) {
        user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      }
    }

    if (!user && phone) {
      const normalizedPhone = normalizePhone(phone);
      if (normalizedPhone) {
        user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: "Invalid credentials." });
    }

    // ✅ Create JWT
    const jwt = await import("jsonwebtoken");
    const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

    const token = jwt.default.sign(
      {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.isAdmin ? "admin" : "user",
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Success response
    res.json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user.id,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    role: user.isAdmin ? "admin" : "user"
  }
});

     
    
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Login failed." });
  }
});*/
