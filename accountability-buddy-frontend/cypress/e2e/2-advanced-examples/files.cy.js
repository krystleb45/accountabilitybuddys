/// <reference types="cypress" />

describe('File Handling in Cypress', () => {
  beforeEach(() => {
    cy.visit('/file-upload-page'); // Adjust URL to your application's page
  });

  it('should upload a file and verify the upload', () => {
    const fileName = 'example-file.txt';
    cy.get('input[type="file"]').attachFile(fileName);
    cy.get('.upload-status').should('contain', 'File uploaded successfully');
  });

  it('should download a file and verify its content', () => {
    cy.get('.download-file-button').click();
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.readFile(`${downloadsFolder}/downloaded-file.txt`).should('exist');
  });

  it('should handle reading a file from the fixtures folder', () => {
    cy.fixture('example.json').then((data) => {
      expect(data.username).to.equal('testuser');
    });
  });

  it('should write data to a file and verify', () => {
    const filePath = 'cypress/outputs/test-output.txt';
    cy.writeFile(filePath, 'This is a test output');
    cy.readFile(filePath).should('equal', 'This is a test output');
  });
});
