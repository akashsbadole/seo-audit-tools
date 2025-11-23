import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log("🌱 Starting to seed users...");

    // Create Admin user
    const adminPassword = await bcrypt.hash("Admin@123456", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@seoaudit.com" },
      update: {},
      create: {
        email: "admin@seoaudit.com",
        name: "System Administrator",
        password: adminPassword,
        role: "ADMIN",
        isPremium: true,
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      isPremium: admin.isPremium,
    });

    // Create Test User
    const userPassword = await bcrypt.hash("User@123456", 10);
    const user = await prisma.user.upsert({
      where: { email: "user@seoaudit.com" },
      update: {},
      create: {
        email: "user@seoaudit.com",
        name: "Test User",
        password: userPassword,
        role: "USER",
        isPremium: false,
      },
    });

    console.log("✅ Test user created:", {
      id: user.id,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
    });

    // Create Premium User
    const premiumPassword = await bcrypt.hash("Premium@123456", 10);
    const premiumUser = await prisma.user.upsert({
      where: { email: "premium@seoaudit.com" },
      update: {},
      create: {
        email: "premium@seoaudit.com",
        name: "Premium User",
        password: premiumPassword,
        role: "USER",
        isPremium: true,
      },
    });

    console.log("✅ Premium user created:", {
      id: premiumUser.id,
      email: premiumUser.email,
      role: premiumUser.role,
      isPremium: premiumUser.isPremium,
    });

    console.log("\n🎉 User seeding completed successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("─────────────────────────────");
    console.log("Admin Account:");
    console.log("  Email: admin@seoaudit.com");
    console.log("  Password: Admin@123456");
    console.log("  Role: ADMIN");
    console.log("");
    console.log("Test User Account:");
    console.log("  Email: user@seoaudit.com");
    console.log("  Password: User@123456");
    console.log("  Role: USER");
    console.log("");
    console.log("Premium User Account:");
    console.log("  Email: premium@seoaudit.com");
    console.log("  Password: Premium@123456");
    console.log("  Role: USER (Premium)");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log("🎉 Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export default seedUsers;
