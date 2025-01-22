import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './Layout'; // Main layout component
import Header from './Header'; // Header component
import Footer from '../Footer/Footer'; // Footer component (if used separately)
import { expect } from '@jest/globals';

// Mock the child components
jest.mock('./Header', () => () => <header data-testid="header">Header</header>);
jest.mock('../Footer/Footer', () => () => (
  <footer data-testid="footer">Footer</footer>
));

describe('Layout Component', () => {
  const renderLayout = (children: React.ReactNode) =>
    render(<Layout>{children}</Layout>);

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

  test('renders the main content', () => {
    const content = 'This is the main content';
    renderLayout(<p>{content}</p>);

    const mainContent = screen.getByText(content);
    expect(mainContent).toBeInTheDocument();
  });

  test('applies correct layout styles', () => {
    renderLayout(<p>Main content</p>);

    const layoutContainer = screen.getByTestId('layout-container');
    expect(layoutContainer).toHaveClass('layout-container');
  });

  test('renders children within the main content area', () => {
    const content = 'Child content';
    renderLayout(<p>{content}</p>);

    const mainContent = screen.getByText(content);
    expect(mainContent).toBeInTheDocument();
  });
});
