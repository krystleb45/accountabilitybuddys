import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { expect } from '@jest/globals';

describe('Footer Component', () => {
  it('renders the footer container', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the footer links', () => {
    render(<Footer />);
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
  });

  it('renders the copyright text', () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 accountability buddy. all rights reserved./i)
    ).toBeInTheDocument();
  });

  it('renders links with correct attributes', () => {
    render(<Footer />);
    const privacyLink = screen.getByText(/privacy policy/i);
    const termsLink = screen.getByText(/terms of service/i);
    const contactLink = screen.getByText(/contact us/i);

    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(privacyLink).toHaveAttribute('target', '_blank');
    expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(termsLink).toHaveAttribute('target', '_blank');
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(contactLink).toHaveAttribute('href', '/contact');
    expect(contactLink).toHaveAttribute('target', '_blank');
    expect(contactLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('matches the snapshot', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
