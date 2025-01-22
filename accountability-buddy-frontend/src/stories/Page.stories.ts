import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Page } from './Page';

/**
 * Metadata for the Page component in Storybook.
 */
const meta: Meta<typeof Page> = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen', // Display the story in fullscreen layout
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Story for a logged-out page view */
export const LoggedOut: Story = {};

/** Story for a logged-in page view with interaction testing */
export const LoggedIn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Simulate a user logging in
    const loginButton = canvas.getByRole('button', { name: /Log in/i });
    await expect(loginButton).toBeInTheDocument(); // Verify the login button exists
    await userEvent.click(loginButton); // Simulate a button click
    await expect(loginButton).not.toBeInTheDocument(); // Verify the button disappears

    // Verify the logout button appears
    const logoutButton = canvas.getByRole('button', { name: /Log out/i });
    await expect(logoutButton).toBeInTheDocument();
  },
};
