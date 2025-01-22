import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions'; // For action logging in Storybook
import { Header } from './Header';

/**
 * Metadata configuration for the Header component in Storybook.
 */
const meta: Meta<typeof Header> = {
  title: 'Example/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen', // Displays the component in fullscreen mode
  },
  tags: ['autodocs'], // Automatically generates documentation
  argTypes: {
    onLogin: { action: 'logged in' },
    onLogout: { action: 'logged out' },
    onCreateAccount: { action: 'account created' },
  },
  args: {
    onLogin: action('onLogin'), // Logs actions to the Storybook actions panel
    onLogout: action('onLogout'),
    onCreateAccount: action('onCreateAccount'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Header with a logged-in user */
export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe', // Simulated user data for the story
    },
  },
};

/** Header with a logged-out state */
export const LoggedOut: Story = {
  args: {
    user: undefined, // Represents the logged-out state
  },
};
