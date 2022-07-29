/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

describe("recomendation suit test", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:5000/e2e/reset-database", {});
  });

  it("should create a new recommendation given a valid input", () => {
    const recommendation = {
      name: faker.music.songName(),
      link: "https://www.youtube.com/watch?v=7aekxC_monc",
    };

    cy.visit("http://localhost:3000");

    cy.get('input[placeholder="Name"]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      recommendation.link
    );

    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "createRecommendation"
    );
    cy.get("button").click();
    cy.wait("@createRecommendation");

    cy.contains(recommendation.name);
  });

  it("add a vote point to a recommendation", () => {
    cy.visit("http://localhost:3000");

    cy.get('d[target="M5 3L0 9h3v4h4V9h3L5 3z"]');
  });
});
