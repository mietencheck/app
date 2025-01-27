import type { Meta, StoryObj } from "@storybook/react";

import { ChevronDownIcon } from "../Icons/ChevronDown";
import { ChevronUpIcon } from "../Icons/ChevronUp";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Design System/Button",
  argTypes: {
    color: {
      options: ["neutral", "primary"],
      control: { type: "radio" },
    },
    variant: {
      options: ["solid", "outline", "ghost", "inline"],
      control: { type: "radio" },
    },
    children: {
      control: { type: "text" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    color: "primary",
    variant: "solid",
    children: "Button",
  },
};

export const Neutral: Story = {
  args: {
    color: "neutral",
    variant: "outline",
    children: "Button",
  },
};

export const IconStart: Story = {
  args: {
    color: "neutral",
    variant: "outline",
    children: "Button with iconStart",
    iconStart: <ChevronDownIcon />,
  },
};

export const IconEnd: Story = {
  args: {
    color: "neutral",
    variant: "outline",
    children: "Button with iconEnd",
    iconEnd: <ChevronUpIcon />,
  },
};
