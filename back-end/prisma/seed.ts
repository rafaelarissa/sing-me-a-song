import { prisma } from "../src/database.js";

async function main() {
  //upsert = update/insert
  //melhor que create por que pode dar conflito em campos unicos
  await prisma.recommendation.upsert({
    where: { name: "Sam Smith - Love Me More (Official Video)" },
    update: {},
    create: {
      name: "Sam Smith - Love Me More (Official Video)",
      youtubeLink: "https://www.youtube.com/watch?v=H1hDzq98WIY",
      score: 0,
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
