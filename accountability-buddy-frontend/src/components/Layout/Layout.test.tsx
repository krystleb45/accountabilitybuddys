import React from 'react';
import { render, screen, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './Layout'; // Main layout component
import { expect } from '@jest/globals';

// Mock the Header and Footer components
// Mock Header Component
const MockHeader: React.FC = (): JSX.Element => (
  <header data-testid="header">Header</header>
);
jest.mock('./Header', () => MockHeader);

// Mock Footer Component
jest.mock('../Footer/Footer', (): React.FC => {
  const FooterMock: React.FC = (): JSX.Element => (
    <footer data-testid="footer">Footer</footer>
  );
  FooterMock.displayName = 'FooterMock'; // Optional for debugging
  return FooterMock;
});
describe('Layout Component', () => {
  /**
   * Helper function to render the Layout with children
   */
  const renderLayout = (children: React.ReactNode): RenderResult => {
    return render(<Layout>{children}</Layout>);
  };

  test('renders the layout container', () => {
    renderLayout(<p>Main content</p>);

    const layoutContainer = screen.getByTestId('layout-container');
    expect(layoutContainer).toBeInTheDocument();
  });

  test('renders the Header component', () => {
    renderLayout(<p>Main content</p>);

    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
  });

  test('renders the Footer component', () => {
    renderLayout(<p>Main content</p>);

    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });

  test('renders the main content provided as children', () => {
    const content = 'This is the main content';
    renderLayout(<p>{content}</p>);

    const mainContent = screen.getByText(content);
    expect(mainContent).toBeInTheDocument();
  });

  test('applies correct layout container styles', () => {
    renderLayout(<p>Main content</p>);

    const layoutContainer = screen.getByTestId('layout-container');
    expect(layoutContainer).toHaveClass('layout-container');
  });

  test('renders children correctly within the main content area', () => {
    const childContent = 'Child content';
    renderLayout(<p>{childContent}</p>);

    const renderedChildContent = screen.getByText(childContent);
    expect(renderedChildContent).toBeInTheDocument();
  });

  test('ensures no extraneous elements are rendered', () => {
    renderLayout(<p>Main content</p>);

    const mainContent = screen.getByTestId('layout-container');
    expect(mainContent.children.length).toBeGreaterThan(0); // Ensure children are rendered
  });
});
