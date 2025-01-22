import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import ForgotPassword from "./ForgotPassword";

export default {
  title: "Components/Forms/ForgotPassword",
  component: ForgotPassword,
  parameters: {
    layout: "centered", // Centers the component in the Storybook canvas
  },
} as Meta<typeof ForgotPassword>;

const Template: StoryFn<typeof ForgotPassword> = (args) => <ForgotPassword {...args} />;

export const Default = Template.bind({});
Default.storyName = "Default View";
