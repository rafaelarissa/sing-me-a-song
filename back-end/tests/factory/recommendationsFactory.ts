import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

export default async function recommendationFactory(recommendation) {
  await prisma.recommendation.create({
    data: {
      ...recommendation,
      score: Math.round(Math.random() * 10),
    },
  });
}
