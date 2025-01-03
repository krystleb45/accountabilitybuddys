/// <reference types="cypress" />

describe('Cookies Management in Cypress', () => {
  beforeEach(() => {
    cy.visit('/cookies-page'); // Adjust URL to your application's page
  });

  it('should set a cookie and verify it', () => {
    cy.setCookie('session_id', '123ABC');
    cy.getCookie('session_id').should('have.property', 'value', '123ABC');
  });

  it('should clear a specific cookie', () => {
    cy.setCookie('session_id', '123ABC');
    cy.clearCookie('session_id');
    cy.getCookie('session_id').should('be.null');
  });

  it('should clear all cookies', () => {
    cy.setCookie('session_id', '123ABC');
    cy.setCookie('user_token', 'token123');
    cy.clearCookies();
    cy.getCookies().should('be.empty');
  });

  it('should check for the existence of a cookie', () => {
    cy.setCookie('user_pref', 'dark-mode');
    cy.getCookie('user_pref').should('exist');
  });

  it('should manage cookies with custom options', () => {
    cy.setCookie('custom_cookie', 'customValue', { httpOnly: true, secure: true });
    cy.getCookie('custom_cookie').should('have.property', 'secure', true);
  });
});
