class RegisterForm {
  elements = {
    // Captura o elemento no DOM (com base no ID)
    titleInput: () => cy.get("#title"),
    titleFeeback: () => cy.get("#titleFeedback"),

    imageUrlInput: () => cy.get("#imageUrl"),
    imageUrlFeeback: () => cy.get("#urlFeedback"),

    submitBtn: () => cy.get("#btnSubmit"),

    imagesList: () => cy.get("#card-list"),
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

    before(() => {
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

  describe("Submitting an image with valid inputs using enter key", () => {
    const input = {
      title: "Alien BR",
      imageUrl:
        "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    before(() => {
      cy.clearAllLocalStorage();
    });

    const svg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`;

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it("When I enter 'Alien BR' in the title field", () => {
      registerForm.typeTitle(input.title);

      registerForm.elements.titleInput().focus();
      registerForm.elements.titleInput().type("{enter}");
    });

    it("Then I should see a check icon in the title field", () => {
      registerForm.elements.titleInput().should((element) => {
        const styles = window.getComputedStyle(element[0]);
        const backgroundImage = styles.backgroundImage;

        assert.equal(backgroundImage, svg);
      });
    });

    it("When I enter 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg' in the URL field", () => {
      registerForm.typeImageUrl(input.imageUrl);
    });

    it("Then I should see a check icon in the imageUrl field", () => {
      registerForm.elements.imageUrlInput().should((element) => {
        const styles = window.getComputedStyle(element[0]);
        const backgroundImage = styles.backgroundImage;

        assert.equal(backgroundImage, svg);
      });
    });

    it("Then I can hit enter to submit the form", () => {
      registerForm.elements.imageUrlInput().focus();
      registerForm.elements.imageUrlInput().type("{enter}");
    });

    it("And the list of registered images should be updated with the new item", () => {
      registerForm.elements.imagesList().children().should("have.length", 4);
    });

    it("And the new item should be stored in the localStorage", () => {
      const localStorageItem = localStorage.getItem("tdd-ew-db");
      const inputString = JSON.stringify([input]);

      assert.equal(localStorageItem, inputString);
    });

    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleInput().should("contains.text", "");
      registerForm.elements.imageUrlInput().should("contains.text", "");
    });
  });

  describe("Submitting an image and updating the list", () => {
    const input = {
      title: "BR Alien",
      imageUrl:
        "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    before(() => {
      cy.clearAllLocalStorage();
    });

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it("Then I have entered 'BR Alien' in the title field", () => {
      registerForm.typeTitle(input.title);
    });

    it("Then I have entered 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg' in the URL field", () => {
      registerForm.typeImageUrl(input.imageUrl);
    });

    it("When I click the submit button", () => {
      registerForm.clickSubmitBtn();
    });

    it("And the list of registered images should be updated with the new item", () => {
      registerForm.elements.imagesList().children().should("have.length", 4);
    });

    it("And the new item should be stored in the localStorage", () => {
      const itemString = localStorage.getItem("tdd-ew-db");
      const inputString = JSON.stringify([input]);

      assert.equal(itemString, inputString);
    });

    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleInput().should("contains.text", "");
      registerForm.elements.imageUrlInput().should("contains.text", "");
    });
  });

  describe("Refreshing the page after submitting an image clicking in the submit button", () => {
    const input = {
      title: "BR Alien",
      imageUrl:
        "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it("Then I have submitted an image by clicking the submit button", () => {
      registerForm.typeTitle(input.title);
      registerForm.typeImageUrl(input.imageUrl);
      registerForm.clickSubmitBtn();
    });

    it("When I refresh the page", () => {
      cy.visit("/");
    });

    it("Then I should still see the submitted image in the list of registered images", () => {
      registerForm.elements.imagesList().children().should("have.length", 4);
    });
  });
});
