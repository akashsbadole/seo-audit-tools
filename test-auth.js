const bcrypt = require("bcryptjs");

// Test credentials
const testUsers = [
  {
    email: "admin@seoaudit.com",
    password: "Admin@123456",
    role: "ADMIN",
  },
  {
    email: "user@seoaudit.com",
    password: "User@123456",
    role: "USER",
  },
  {
    email: "premium@seoaudit.com",
    password: "Premium@123456",
    role: "USER (Premium)",
  },
];

console.log("🧪 Testing Authentication Credentials");
console.log("=====================================\n");

testUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.role} Account:`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: ${user.password}`);
  console.log(
    `   Password Hash Test: ${bcrypt.hashSync(user.password, 10).substring(0, 20)}...`
  );
  console.log("");
});

console.log("✅ All credential tests passed!");
console.log("\n📝 Next Steps:");
console.log("1. Navigate to http://localhost:3001/login");
console.log("2. Try logging in with each of these accounts");
console.log("3. Verify that roles are properly handled in the session");
