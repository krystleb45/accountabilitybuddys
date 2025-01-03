/// <reference types="cypress" />

describe('Cypress API Examples', () => {
  beforeEach(() => {
    cy.visit('/cypress-api-page'); // Adjust URL to your application's page
  });

  it('should demonstrate cy.request() for making API calls', () => {
    cy.request('GET', '/api/data').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('data');
    });
  });

  it('should use cy.wrap() to wrap a value and perform assertions', () => {
    cy.wrap(42).should('equal', 42);
  });

  it('should use cy.wait() to wait for a specified amount of time', () => {
    cy.wait(1000); // Waits for 1 second
    cy.get('.wait-complete').should('be.visible');
  });

  it('should use cy.task() to run a task from plugins', () => {
    cy.task('log', 'Running a custom task from plugins');
  });

  it('should demonstrate cy.spy() and cy.stub()', () => {
    const obj = {
      method: () => 'Hello World',
    };

    const spy = cy.spy(obj, 'method').as('methodSpy');
    obj.method();
    expect(spy).to.have.been.calledOnce;

    const stub = cy.stub(obj, 'method').returns('Hello Cypress');
    obj.method();
    expect(stub).to.have.been.calledOnce;
  });
});
