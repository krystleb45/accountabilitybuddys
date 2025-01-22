import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Card from './Card';

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    onClick: { action: 'clicked' }, // Logs clicks in Storybook actions
    elevated: { control: 'boolean' }, // Adds a toggle control for the "elevated" prop
    bordered: { control: 'boolean' }, // Adds a toggle control for the "bordered" prop
    className: { control: 'text' }, // Allows users to input custom class names
  },
} as Meta<typeof Card>;

const Template: StoryFn<typeof Card> = (args) => (
  <Card {...args}>{args.children}</Card>
);

export const Default = Template.bind({});
Default.args = {
  children: 'This is a default card.',
};

export const Elevated = Template.bind({});
Elevated.args = {
  children: 'This card has an elevated shadow.',
  elevated: true,
};

export const Bordered = Template.bind({});
Bordered.args = {
  children: 'This card has a border.',
  bordered: true,
};

export const Interactive = Template.bind({});
Interactive.args = {
  children: 'This card is clickable. Click to log an action!',
  onClick: () => alert('Card clicked!'), // Example interaction
};

export const CustomClass = Template.bind({});
CustomClass.args = {
  children: 'This card has a custom class for styling.',
  className: 'custom-class',
};
