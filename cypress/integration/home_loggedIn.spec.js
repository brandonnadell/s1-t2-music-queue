import firebase from "../../client/firebase";

describe("Home Page (Logged In)", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.loginAsAdmin();
    cy.visit("http://localhost:3000/");
  });

  it("went to localhost", () => {
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("has main div", () => {
    cy.get("[data-cy=room_home]").should("exist");
  });

  it("has create room component", () => {
    cy.get("[data-cy=create_room]").should("exist");
  });

  it("has join room component", () => {
    cy.get("[data-cy=join_room]").should("exist");
  });
});
