/// <reference types="cypress" />

describe('Local Storage and Session Storage', () => {
  beforeEach(() => {
    cy.visit('/storage-page'); // Adjust URL to your application's page
  });

  it('should set and retrieve a value from local storage', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('key', 'value');
    });
    cy.getLocalStorage('key').should('equal', 'value');
  });

  it('should clear local storage', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('key', 'value');
    });
    cy.clearLocalStorage();
    cy.getLocalStorage('key').should('be.null');
  });

  it('should set and retrieve a value from session storage', () => {
    cy.window().then((win) => {
      win.sessionStorage.setItem('sessionKey', 'sessionValue');
    });
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('sessionKey')).to.equal('sessionValue');
    });
  });

  it('should clear session storage', () => {
    cy.window().then((win) => {
      win.sessionStorage.setItem('sessionKey', 'sessionValue');
    });
    cy.window().then((win) => {
      win.sessionStorage.clear();
      expect(win.sessionStorage.getItem('sessionKey')).to.be.null;
    });
  });
});
