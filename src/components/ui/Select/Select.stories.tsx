import type { Meta, StoryObj } from "@storybook/react";

import { Select, SelectOption } from "./Select";

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Design System/Select",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    "aria-label":
      "Ist im Mietvertrag eine Staffelmiete oder Indexmiete vereinbart?",
    placeholder: "Bitte auswählen...",
    children: (
      <>
        <SelectOption id="staffelmiete">Staffelmiete</SelectOption>
        <SelectOption id="indexmiete">Indexmiete</SelectOption>
        <SelectOption id="none">Keins von beiden</SelectOption>
        <SelectOption id="unsure">Ich bin mir nicht sicher</SelectOption>
      </>
    ),
  },
};
