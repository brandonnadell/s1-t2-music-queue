import firebase from "../../client/firebase";

describe("Home Page (Not Logged In)", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.visit("http://localhost:3000");
  });

  it("not logged in warning", () => {
    cy.get("[data-cy=not_logged]").should("exist");
  });

  it("has a login button", () => {
    cy.get("[data-cy=login]").should("exist");
  });
});
