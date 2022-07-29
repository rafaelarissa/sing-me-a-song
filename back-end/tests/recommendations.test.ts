import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database.js";
import { CreateRecommendationData } from "../src/services/recommendationsService.js";
import recommendationBodyFactory from "./factory/recommendationBodyFactory.js";
import recommendationFactory from "./factory/recommendationsFactory";

describe("Recommendations tests - POST /recommendations", () => {
  beforeEach(truncateRecommendations);

  afterAll(disconnect);

  it("should return 201 given a valid body", async () => {
    const body = recommendationBodyFactory();

    const response = await supertest(app)
      .post("/recommendations")
      .send(body[0]);

    expect(response.status).toEqual(201);
  });

  it("should return 422 given invalid body", async () => {
    const body = {};

    const response = await supertest(app).post("/recommendations").send(body);

    expect(response.status).toEqual(422);
  });

  it("should return 409 given an existing name", async () => {
    const body = recommendationBodyFactory();

    await supertest(app).post("/recommendations").send(body[0]);
    const response = await supertest(app)
      .post("/recommendations")
      .send(body[0]);
    const recommendations = await prisma.recommendation.findMany({
      where: { name: body[0].name },
    });

    expect(response.status).toEqual(409);
    expect(recommendations.length).toEqual(1);
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

describe("Recommendations tests - POST /recommendations/:id/downvote", () => {
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
      .post(`/recommendations/${id}/downvote`)
      .send();

    expect(response.status).toEqual(200);
  });

  it("should return 404 if given unexisting recommendation", async () => {
    const id = 0;

    const response = await supertest(app)
      .post(`/recommendations/${id}/downvote`)
      .send();

    expect(response.status).toEqual(404);
  });
});

describe("GET /recommendations", () => {
  beforeEach(truncateRecommendations);

  afterAll(disconnect);

  it("should return 200 and contain less than 11 items", async () => {
    const response = await supertest(app).get("/recommendations");

    expect(response.body.length).toBeLessThanOrEqual(10);
    expect(response.status).toEqual(200);
  });
});

describe("GET /recommendations/:id", () => {
  beforeEach(truncateRecommendations);

  afterAll(disconnect);

  it("should return 200 given existing recommendation id", async () => {
    const body: CreateRecommendationData = {
      name: "Joji Best Songs Collections - Joji Greatest Hits - Joji Songs Full Playlist - The Best Of Joji",
      youtubeLink: "https://www.youtube.com/watch?v=81AShKbT_TY",
    };

    await supertest(app).post("/recommendations").send(body);
    const recommendation = await supertest(app).get("/recommendations");
    const id = recommendation.body[0].id;

    const response = await supertest(app).get(`/recommendations/${id}`);

    expect(response.status).toEqual(200);
  });

  it("should return 404 given unexisting recommendation id", async () => {
    const id = 0;
    const response = await supertest(app).get(`/recommendations/${id}`);

    expect(response.status).toEqual(404);
  });
});

describe("GET /recommendations/top/:ammount", () => {
  beforeEach(truncateRecommendations);

  afterAll(disconnect);

  it("should return 200 if get top songs correctly", async () => {
    const amount = 3;
    const body = recommendationBodyFactory();

    await supertest(app).post("/recommendations").send(body);

    const response = await supertest(app).get(`/recommendations/top/${amount}`);
    expect(response.body.length).toBeLessThanOrEqual(amount);
  });
});

describe("GET /recommendations/random", () => {
  beforeEach(truncateRecommendations);

  afterAll(disconnect);

  it("should return 200 given a score more or equal to 10", async () => {
    const recommendations = recommendationBodyFactory();

    const create = await prisma.recommendation.create({
      data: { ...recommendations[0], score: 100 },
    });

    const response = await supertest(app).get("/recommendations/random");

    expect(response.body).toEqual(create);
  });
  it("should return 404 given no recommendation", async () => {
    const response = await supertest(app).get("/recommendations/random");

    expect(response.status).toEqual(404);
  });
});

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations";`;
}
