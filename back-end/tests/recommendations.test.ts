import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database.js";
import { CreateRecommendationData } from "../src/services/recommendationsService.js";

describe("Recommendations tests - POST /recommendations", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations";`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return 201 given a valid body", async () => {
    const body: CreateRecommendationData = {
      name: "Falamansa - Xote dos Milagres",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toEqual(201);
  });

  it("should return 422 given a invalid body", async () => {
    const body = {};

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toEqual(422);
  });

  it("should return 409 given a existing name", async () => {
    const body: CreateRecommendationData = {
      name: "Falamansa - Xote dos Milagres",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    await supertest(app).post("/recommendations").send(body);
    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toEqual(409);
  });
});
