/// <reference types="cypress" />

describe('Cypress Utility Functions', () => {
  beforeEach(() => {
    cy.visit('/utilities-page'); // Adjust URL to your application's page
  });

  it('should use Cypress._.isArray to check if a variable is an array', () => {
    const array = [1, 2, 3];
    expect(Cypress._.isArray(array)).to.be.true;
  });

  it('should use Cypress.$ to select a DOM element', () => {
    const header = Cypress.$('.utilities-header');
    expect(header.length).to.be.greaterThan(0);
  });

  it('should use Cypress.log to output a custom log message', () => {
    Cypress.log({
      name: 'Custom Log',
      message: 'This is a custom log message',
      consoleProps: () => {
        return { custom: 'data' };
      },
    });
  });

  it('should use Cypress.env to access environment variables', () => {
    const envVariable = Cypress.env('MY_ENV_VARIABLE');
    expect(envVariable).to.exist;
  });
});
