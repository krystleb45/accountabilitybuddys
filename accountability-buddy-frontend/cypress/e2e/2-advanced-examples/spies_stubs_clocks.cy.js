/// <reference types="cypress" />

describe('Spies, Stubs, and Clocks in Cypress', () => {
  it('should spy on a function and check if it was called', () => {
    const obj = {
      method: () => 'Hello World',
    };
    const spy = cy.spy(obj, 'method').as('methodSpy');
    obj.method();
    expect(spy).to.have.been.calledOnce;
  });

  it('should stub a method and change its behavior', () => {
    const obj = {
      method: () => 'Original Response',
    };
    const stub = cy.stub(obj, 'method').returns('Stubbed Response');
    obj.method();
    expect(stub).to.have.been.calledOnce;
    expect(obj.method()).to.equal('Stubbed Response');
  });

  it('should use a clock to control time', () => {
    cy.clock();
    const now = new Date().getTime();
    cy.tick(5000); // Advance time by 5 seconds
    expect(new Date().getTime()).to.equal(now + 5000);
  });

  it('should use a clock to manage timers', () => {
    let called = false;
    setTimeout(() => {
      called = true;
    }, 1000);
    cy.clock();
    cy.tick(1000); // Fast-forward time by 1 second
    expect(called).to.be.true;
  });
});
