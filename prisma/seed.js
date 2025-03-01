// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create emotions
  const emotions = [
    { name: "Happy" },
    { name: "Sad" },
    { name: "Angry" },
    { name: "Anxious" },
    { name: "Calm" },
  ];

  for (const emotion of emotions) {
    await prisma.emotion.upsert({
      where: { name: emotion.name },
      update: {},
      create: emotion,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
