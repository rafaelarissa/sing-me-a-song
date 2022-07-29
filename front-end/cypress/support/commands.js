// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("createRecommendation", (recommendation) => {
  cy.visit("http://localhost:3000/");

  cy.get('input[placeholder="Name"]').type(recommendation.name);
  cy.get('input[placeholder="https://youtu.be/..."]').type(recommendation.link);

  cy.intercept("POST", "http://localhost:5000/recommendations").as(
    "createRecommendation"
  );

  cy.get("button").click();
  cy.wait("@createRecommendation");
});

Cypress.Commands.add("upvote", (recommendation) => {
  cy.contains(recommendation.name)
    .get("article")
    .within(() => {
      cy.get("div:last-of-type").should("have.text", "0");
    });

  cy.contains(recommendation.name)
    .get("article")
    .within(() => {
      cy.get("svg:first-of-type").click();
    });

  cy.reload();

  cy.contains(recommendation.name)
    .get("article")
    .within(() => {
      cy.get("div:last-of-type").should("have.text", "1");
    });
});

Cypress.Commands.add("downvote", (recommendation) => {
  cy.contains(recommendation.name)
    .get("article")
    .within(() => {
      cy.get("div:last-of-type").should("have.text", "0");
    });

  cy.contains(recommendation.name)
    .get("article")
    .within(() => {
      cy.get("svg:last-of-type").click();
    });

  cy.reload();

  cy.contains(recommendation.name)
    .get("article")
    .within(() => {
      cy.get("div:last-of-type").should("have.text", "-1");
    });
});

Cypress.Commands.add("deleteTest", (recommendation) => {
  Cypress._.times(6, (k) => {
    cy.contains(recommendation.name)
      .get("article")
      .within(() => {
        cy.get("svg:last-of-type").click();
      });
  });
});

Cypress.Commands.add("alertTest", () => {
  cy.on("window:alert", (text) => {
    expect(text).to.contains("Error creating recommendation!");
  });
});

Cypress.Commands.add("resetDatabase", () => {
  cy.request("POST", "http://localhost:5000/e2e/reset-database", {});
});

Cypress.Commands.add("seedDB", () => {
  cy.request("POST", "http://localhost:5000/recommendations/seed", {});
});
