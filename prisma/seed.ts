import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed User
  const email = "nayakraja@gmail.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name: "Raja Nayak",
      role: "ADMIN",
    },
  });
  console.log(`Seed user created: ${email}`);

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