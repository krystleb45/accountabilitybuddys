/// <reference types="cypress" />

describe('Todo App', () => {
  beforeEach(() => {
    cy.visit('/todo');
  });

  it('should load the todo app', () => {
    cy.get('.todo-header').should('contain', 'Todo List');
    cy.title().should('include', 'Todo');
  });

  it('should add a new todo item', () => {
    cy.get('.new-todo-input').type('New Todo Item{enter}');
    cy.get('.todo-list').should('contain', 'New Todo Item');
  });

  it('should mark a todo item as completed', () => {
    cy.get('.todo-item').first().find('.toggle-completed').click();
    cy.get('.todo-item').first().should('have.class', 'completed');
  });

  it('should delete a todo item', () => {
    cy.get('.todo-item').first().find('.delete-button').click();
    cy.get('.todo-item').should('have.length.lessThan', 1);
  });
});
