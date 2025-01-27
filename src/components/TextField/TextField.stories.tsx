import type { Meta, StoryObj } from "@storybook/react";

import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  component: TextField,
  title: "Design System/TextField",
  argTypes: {
    type: {
      description: "The type of input to render.",
      control: "radio",
      options: ["text", "number", "search", "url", "tel", "email", "password"],
      defaultValue: "text",
    },
    inputMode: {
      description:
        "Hints at the type of data that might be entered by the user while editing the element or its contents",
      control: "radio",
      options: [
        "none",
        "text",
        "tel",
        "url",
        "email",
        "numeric",
        "decimal",
        "search",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {},
};
