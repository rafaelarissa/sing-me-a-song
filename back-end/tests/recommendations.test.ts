import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database.js";
import { CreateRecommendationData } from "../src/services/recommendationsService.js";

describe("Recommendations tests - POST /recommendations", () => {
  beforeEach(truncateRecommendations);

  afterAll(disconnect);

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

describe("Recommendations tests - POST /recommendations/:id/upvote", () => {
  beforeEach(truncateRecommendations);

  afterAll(disconnect);

  it("should return 200 given valid id", async () => {
    const body: CreateRecommendationData = {
      name: "Joji Best Songs Collections - Joji Greatest Hits - Joji Songs Full Playlist - The Best Of Joji",
      youtubeLink: "https://www.youtube.com/watch?v=81AShKbT_TY",
    };

    await supertest(app).post("/recommendations").send(body);
    const recommendation = await supertest(app).get("/recommendations");
    const id = recommendation.body[0].id;

    const response = await supertest(app)
      .post(`/recommendations/${id}/upvote`)
      .send();

    expect(response.status).toEqual(200);
  });

  it("should return 404 if given unexisting recommendation", async () => {
    const id = 0;

    const response = await supertest(app)
      .post(`/recommendations/${id}/upvote`)
      .send();

    expect(response.status).toEqual(404);
  });
});

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations";`;
}
