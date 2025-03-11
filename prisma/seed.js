import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const emotions = [
    { name: "Happy" },
    { name: "Sad" },
    { name: "Calm" },
    { name: "Angry" },
    { name: "Anxious" },
    { name: "Neutral" },
    { name: "Stressed" },
    { name: "Excited" },
    { name: "Tired" },
    { name: "Confused" },
    { name: "Loved" },
    { name: "Grateful" },
  ];

  for (const emotion of emotions) {
    await prisma.emotion.upsert({
      where: { name: emotion.name },
      update: {},
      create: emotion,
    });
  }

  console.log("Emotions seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
