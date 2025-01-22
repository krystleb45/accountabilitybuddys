import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Dashboard from './Dashboard';

export default {
  title: 'Components/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Dashboard>;

const Template: StoryFn<typeof Dashboard> = (args) => <Dashboard {...args} />;

export const Default = Template.bind({});
Default.args = {
  userStats: {
    totalGoals: 10,
    completedGoals: 7,
    collaborations: 3,
  },
  recentActivities: [
    "Completed the 'Fitness Challenge' goal",
    "Collaborated with Alex on 'Project X'",
    "Started the 'Healthy Eating' goal",
  ],
  onAction: (action: string) => console.log(`Action triggered: ${action}`),
};
