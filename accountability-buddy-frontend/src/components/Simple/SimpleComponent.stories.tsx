import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import SimpleComponent from './SimpleComponent';

export default {
  title: 'Components/SimpleComponent',
  component: SimpleComponent,
  argTypes: {
    message: { control: 'text' },
    className: { control: 'text' },
    id: { control: 'text' },
  },
} as Meta<typeof SimpleComponent>;

const Template: StoryFn<typeof SimpleComponent> = (args) => (
  <SimpleComponent {...args} />
);
export const Default = Template.bind({});
Default.args = {
  message: 'Simple Component',
};

export const CustomMessage = Template.bind({});
CustomMessage.args = {
  message: 'Custom Message',
};
export const StyledComponent = Template.bind({});
StyledComponent.args = {
  message: 'Styled Component',
  className: 'custom-class',
};

export const WithID = Template.bind({});
WithID.args = {
  message: 'Component with ID',
  id: 'custom-id',
};
