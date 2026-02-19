import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log("🌱 Starting to seed users...");

    const admin = await prisma.user.upsert({
      where: { email: "admin@seoaudit.com" },
      update: {},
      create: {
        id: `admin_${Date.now()}`,
        email: "admin@seoaudit.com",
        name: "System Administrator",
        isPremium: true,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      email: admin.email,
      isPremium: admin.isPremium,
    });

    const user = await prisma.user.upsert({
      where: { email: "user@seoaudit.com" },
      update: {},
      create: {
        id: `user_${Date.now()}`,
        email: "user@seoaudit.com",
        name: "Test User",
        isPremium: false,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Test user created:", {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
    });

    const premiumUser = await prisma.user.upsert({
      where: { email: "premium@seoaudit.com" },
      update: {},
      create: {
        id: `premium_${Date.now()}`,
        email: "premium@seoaudit.com",
        name: "Premium User",
        isPremium: true,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Premium user created:", {
      id: premiumUser.id,
      email: premiumUser.email,
      isPremium: premiumUser.isPremium,
    });

    console.log("\n🎉 User seeding completed successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("─────────────────────────────");
    console.log("Admin Account:");
    console.log("  Email: admin@seoaudit.com");
    console.log("Test User Account:");
    console.log("  Email: user@seoaudit.com");
    console.log("Premium User Account:");
    console.log("  Email: premium@seoaudit.com");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers()
  .then(() => {
    console.log("🎉 Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

export default seedUsers;
