import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://erickwendel.github.io/vanilla-js-web-app-example/", // Site a ser testado
    testIsolation: false, // Não limpa o estado da tela após cada it
  },
});
