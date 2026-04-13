import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
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