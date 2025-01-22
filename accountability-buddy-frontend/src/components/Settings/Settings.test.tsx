import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileSettings from 'src/components/Profile/ProfileSettings';
import ResourceLinks from './ResourceLinks';
import ThemeToggle from 'src/components/General/ThemeToggle';
import { expect } from '@jest/globals';

describe('Settings Components', () => {
  describe('ProfileSettings', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
    };
    const mockOnUpdate = jest.fn();

    it('renders profile settings correctly', () => {
      render(<ProfileSettings user={mockUser} onUpdate={mockOnUpdate} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('calls onUpdate with updated data when the form is submitted', () => {
      render(<ProfileSettings user={mockUser} onUpdate={mockOnUpdate} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /update profile/i,
      });

      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(emailInput, {
        target: { value: 'janedoe@example.com' },
      });
      fireEvent.click(submitButton);

      expect(mockOnUpdate).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      });
    });
  });

  describe('ResourceLinks', () => {
    const mockResources = [
      { id: '1', name: 'Resource 1', link: 'https://example.com/resource1' },
      { id: '2', name: 'Resource 2', link: 'https://example.com/resource2' },
    ];

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockResources,
      } as Response);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('renders resource links correctly', async () => {
      render(<ResourceLinks />);

      expect(await screen.findByText(/resource 1/i)).toBeInTheDocument();
      expect(await screen.findByText(/resource 2/i)).toBeInTheDocument();
    });

    it('displays an error message if resources fail to load', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response);

      render(<ResourceLinks />);

      expect(
        await screen.findByText(/failed to fetch resources/i)
      ).toBeInTheDocument();
    });
  });

  describe('ThemeToggle', () => {
    const mockOnToggle = jest.fn();

    it('renders the theme toggle button', () => {
      render(<ThemeToggle onToggle={mockOnToggle} isDarkMode={false} />);

      expect(
        screen.getByRole('button', { name: /toggle theme/i })
      ).toBeInTheDocument();
    });

    it('calls onToggle when the button is clicked', () => {
      render(<ThemeToggle onToggle={mockOnToggle} isDarkMode={false} />);

      const toggleButton = screen.getByRole('button', {
        name: /toggle theme/i,
      });
      fireEvent.click(toggleButton);

      expect(mockOnToggle).toHaveBeenCalled();
    });
  });
});
