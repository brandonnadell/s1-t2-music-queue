import firebase from "../../client/firebase";

describe("Queue (Logged In)", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.loginAsAdmin();
    cy.visit("http://localhost:3000/room/room_key");
  });

  it("has a Queue song botton clickable", () => {
    cy.get("[data-cy=queue]").should("exist");
  });

  it("has a search botton clickable", () => {
    cy.get("[data-cy=search]").should("exist");
  });
});
