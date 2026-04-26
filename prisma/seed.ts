import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "nayakraja@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "password123";
  const name = process.env.ADMIN_NAME || "Raja Nayak";
  const hashedPassword = await bcrypt.hash(password, 12);

  console.log("Seeding admin user...");
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      password: hashedPassword,
      name,
      role: "ADMIN"
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: "ADMIN",
    },
  });

  console.log("-----------------------------------------------");
  console.log("✅ Admin user seeded successfully!");
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Role:     ${user.role}`);
  console.log("-----------------------------------------------");
  console.log("⚠️ IMPORTANT: Please change your password after the first login.");
  console.log("-----------------------------------------------");

  await prisma.order.createMany({
    data: [
      {
        orderNumber: "ORD-SEED-1001",
        tenantId: "tenant-demo",
        amount: 499.99,
        currency: "INR",
        status: "CREATED",
        paymentStatus: "PENDING",
        inventoryStatus: "PENDING"
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });