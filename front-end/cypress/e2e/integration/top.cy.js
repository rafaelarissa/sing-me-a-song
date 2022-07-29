/// <reference types="cypress" />

describe("Top page tests", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.seedDatabase();
  });

  it("should return recommendations according to the amount", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Top").click();

    cy.url().should("equal", "http://localhost:3000/top");

    cy.get("article:first-of-type").within(() => {
      cy.get("div:last-of-type").should("have.text", "343");
    });

    cy.get("article:last-of-type").within(() => {
      cy.get("div:last-of-type").should("have.text", "0");
    });
  });
});
