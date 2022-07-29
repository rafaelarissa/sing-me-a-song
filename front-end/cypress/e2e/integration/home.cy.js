/// <reference types="cypress" />

import recommendationBodyFactory from "./factories/recommendationBodyFactory";

describe("recommendation suit test", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should create a new recommendation given a valid input", () => {
    const recommendation = recommendationBodyFactory();

    cy.createRecommendation(recommendation);

    cy.contains(recommendation.name);

    cy.end();
  });

  it("should add a vote point to a recommendation", () => {
    const recommendation = recommendationBodyFactory();

    cy.createRecommendation(recommendation);

    cy.upvote(recommendation);

    cy.end();
  });

  it("should decrease a vote point to a recommendation", () => {
    const recommendation = recommendationBodyFactory();

    cy.createRecommendation(recommendation);

    cy.downvote(recommendation);

    cy.end();
  });
});
