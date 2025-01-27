import type { Meta, StoryObj } from "@storybook/react";

import { ListBox, ListBoxItem } from "./ListBox";

const meta: Meta<typeof ListBox> = {
  component: ListBox,
  title: "Design System/ListBox",
  argTypes: {
    selectionBehavior: {
      options: ["toggle", "replace"],
      control: { type: "radio" },
    },
    selectionMode: {
      options: ["none", "single", "multiple"],
      control: { type: "radio" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ListBox>;

export const Default: Story = {
  args: {
    "aria-label": "Favorite animal",
    children: (
      <>
        <ListBoxItem>Aardvark</ListBoxItem>
        <ListBoxItem>Cat</ListBoxItem>
        <ListBoxItem>Dog</ListBoxItem>
        <ListBoxItem>Kangaroo</ListBoxItem>
        <ListBoxItem>Panda</ListBoxItem>
        <ListBoxItem>Snake</ListBoxItem>
      </>
    ),
  },
};

export const SingleSelect: Story = {
  args: {
    "aria-label": "Favorite animal",
    children: (
      <>
        <ListBoxItem>Aardvark</ListBoxItem>
        <ListBoxItem>Cat</ListBoxItem>
        <ListBoxItem>Dog</ListBoxItem>
        <ListBoxItem>Kangaroo</ListBoxItem>
        <ListBoxItem>Panda</ListBoxItem>
        <ListBoxItem>Snake</ListBoxItem>
      </>
    ),
    selectionMode: "single",
  },
};
