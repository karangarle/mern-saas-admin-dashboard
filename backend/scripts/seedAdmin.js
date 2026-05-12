/**
 * Seed Script — Creates the first Admin user
 *
 * Usage:
 *   node scripts/seedAdmin.js
 *   npm run seed:admin
 *
 * Reads from .env:
 *   SEED_ADMIN_NAME     (default: "Super Admin")
 *   SEED_ADMIN_EMAIL    (required)
 *   SEED_ADMIN_PASSWORD (required — must be strong)
 *   MONGODB_URI         (required)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const {
  MONGODB_URI,
  SEED_ADMIN_NAME = "Super Admin",
  SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD,
} = process.env;

// ── Validation ────────────────────────────────────────────────────────────────
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set in .env");
  process.exit(1);
}

if (!SEED_ADMIN_EMAIL) {
  console.error("❌  SEED_ADMIN_EMAIL is not set in .env");
  process.exit(1);
}

if (!SEED_ADMIN_PASSWORD) {
  console.error("❌  SEED_ADMIN_PASSWORD is not set in .env");
  process.exit(1);
}

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

if (!strongPasswordRegex.test(SEED_ADMIN_PASSWORD)) {
  console.error(
    "❌  SEED_ADMIN_PASSWORD must include uppercase, lowercase, number, and symbol (min 8 chars)"
  );
  process.exit(1);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seedAdmin() {
  console.log("🔗  Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected.");

  const normalizedEmail = SEED_ADMIN_EMAIL.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    if (existing.role === "admin") {
      console.log(`ℹ️   Admin already exists: ${normalizedEmail} (no changes made)`);
    } else {
      // Upgrade existing user to admin
      existing.role = "admin";
      existing.isActive = true;
      await existing.save();
      console.log(`⬆️   Upgraded existing user to admin: ${normalizedEmail}`);
    }
  } else {
    await User.create({
      name: SEED_ADMIN_NAME,
      email: normalizedEmail,
      password: SEED_ADMIN_PASSWORD,
      role: "admin",
      isActive: true,
    });

    console.log("🎉  Admin user created successfully!");
    console.log(`    Name  : ${SEED_ADMIN_NAME}`);
    console.log(`    Email : ${normalizedEmail}`);
    console.log(`    Role  : admin`);
  }

  await mongoose.disconnect();
  console.log("🔌  Disconnected. Done.");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
