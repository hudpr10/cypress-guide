class RegisterForm {
  elements = {
    // Captura o elemento no DOM (com base no ID)
    titleInput: () => cy.get("#title"),
    titleFeeback: () => cy.get("#titleFeedback"),

    imageUrlInput: () => cy.get("#imageUrl"),
    imageUrlFeeback: () => cy.get("#urlFeedback"),

    submitBtn: () => cy.get("#btnSubmit"),
  };

  typeTitle = (title) => {
    if (!title) return;
    this.elements.titleInput().type(title);
  };

  typeImageUrl = (url) => {
    if (!url) return;
    this.elements.imageUrlInput().type(url);
  };

  clickSubmitBtn = () => {
    this.elements.submitBtn().click();
  };
}

const registerForm = new RegisterForm();

describe("Image Registration", () => {
  describe("Submitting an image with invalid inputs", () => {
    const input = {
      title: "",
      imageUrl: "",
    };

    after(() => {
      cy.clearAllLocalStorage();
    });

    it("Given I am on the image registration page", () => {
      cy.visit("/"); // Pega do baseUrl no cypress.config.js
    });

    it(`When I enter "${input.title}" in the title field`, () => {
      // Digita no DOM
      registerForm.typeTitle(input.title);
    });

    it(`Then I enter "${input.imageUrl}" in the URL field`, () => {
      registerForm.typeImageUrl(input.imageUrl);
    });

    it(`Then I click the submit button`, () => {
      registerForm.clickSubmitBtn();
    });

    it(`Then I should see "Please type a title for the image." message above the title field`, () => {
      registerForm.elements
        .titleFeeback()
        .should("contains.text", "Please type a title for the image.");

      // Debuggar no DOM
      // registerForm.elements.titleFeeback().should((element) => {
      //   debugger;
      // });
    });

    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements
        .imageUrlFeeback()
        .should("contains.text", "Please type a valid URL");
    });

    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      const expectedImg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")`;

      registerForm.elements.titleInput().should((element) => {
        const styles = window.getComputedStyle(element[0]);
        const img = styles.backgroundImage;

        assert.equal(img, expectedImg);
      });
    });
  });
});
