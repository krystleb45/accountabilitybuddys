import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';

// Configure the Storybook metadata for the Button component
const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered', // Center the component in the canvas
  },
  tags: ['autodocs'], // Automatically generate documentation
  argTypes: {
    backgroundColor: { control: 'color' }, // Add a color picker for the backgroundColor prop
  },
  args: {
    onClick: action('button-click'), // Log actions to the Storybook actions panel
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button story
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Primary Button',
  },
};

// Secondary button story
export const Secondary: Story = {
  args: {
    primary: false,
    label: 'Secondary Button',
  },
};

// Large button story
export const Large: Story = {
  args: {
    size: 'large',
    label: 'Large Button',
  },
};

// Small button story
export const Small: Story = {
  args: {
    size: 'small',
    label: 'Small Button',
  },
};

// Custom button story (e.g., for "Accountability Buddy" theme)
export const Accountability: Story = {
  args: {
    primary: false,
    label: 'Custom Button',
    backgroundColor: '#f0ad4e', // Example custom style
  },
};
