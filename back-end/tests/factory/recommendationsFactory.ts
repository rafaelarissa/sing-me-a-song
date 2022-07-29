import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

export default async function recommendationFactory(
  recommendation: CreateRecommendationData
) {
  await prisma.recommendation.createMany({
    data: {
      ...recommendation,
      score: Math.round(Math.random() * 10),
    },
  });
}
