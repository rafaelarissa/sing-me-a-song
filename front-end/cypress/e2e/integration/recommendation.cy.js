/// <reference types="cypress" />

import recommendationBodyFactory from "./factories/recommendationBodyFactory";

describe("recomendation suit test", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should create a new recommendation given a valid input", () => {
    const recommendation = recommendationBodyFactory();

    cy.createRecommendation(recommendation);

    cy.contains(recommendation.name);

    cy.end();
  });

  it("add a vote point to a recommendation", () => {
    cy.visit("http://localhost:3000");

    cy.get('d[target="M5 3L0 9h3v4h4V9h3L5 3z"]');
  });
});
