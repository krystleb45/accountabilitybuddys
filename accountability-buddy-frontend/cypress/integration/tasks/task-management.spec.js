/// <reference types="cypress" />

describe('Task Management', () => {
  before(() => {
    cy.login(); // Custom command to handle login
  });

  beforeEach(() => {
    cy.visit('/tasks');
  });

  it('should display the task management page', () => {
    cy.contains(/task management/i).should('be.visible');
  });

  it('should create a new task successfully', () => {
    cy.get('input[placeholder="Enter new task"]').type('New Task');
    cy.get('button[aria-label="Add Task"]').click();
    
    // Verify the new task appears in the task list
    cy.contains('New Task').should('be.visible');
  });

  it('should mark a task as completed', () => {
    cy.get('.task-item').first().find('input[type="checkbox"]').check();
    cy.get('.task-item.completed').should('exist'); // Verify task is marked as completed
  });

  it('should delete a task', () => {
    cy.get('.task-item').first().find('button[aria-label="Delete Task"]').click();
    
    // Verify the task is removed from the list
    cy.get('.task-item').should('have.length.lessThan', 5); // Adjust the number based on initial task count
  });

  // Add more tests as needed for other task features
});
