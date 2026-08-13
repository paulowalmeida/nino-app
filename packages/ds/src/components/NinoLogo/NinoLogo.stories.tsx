import type { Meta, StoryObj } from '@storybook/react'

import { NinoLogo } from './NinoLogo'

const meta: Meta<typeof NinoLogo> = {
  title: 'Components/NinoLogo',
  component: NinoLogo,
  tags: ['autodocs'],
  args: { size: 'lg', tone: 'dark' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Label color — "light" for use over a dark background',
    },
    label: {
      control: 'text',
      description: 'App-specific small-caps text under the wordmark',
    },
    hideWordmark: {
      control: 'boolean',
      description: 'Collapsed state — shows only the mark',
    },
    href: {
      control: 'text',
      description: 'When set, the logo becomes a link',
    },
  },
}

export default meta
type Story = StoryObj<typeof NinoLogo>

export const Default: Story = {}

/** As it appears in the manager app, with its own app label. */
export const WithAppLabel: Story = {
  args: { label: 'GESTOR' },
}

/** Collapsed sidebar state — mark only, no wordmark. */
export const MarkOnly: Story = {
  args: { size: 'sm', hideWordmark: true },
}

/** Over a dark background — label switches to a lighter tone. */
export const LightTone: Story = {
  args: { tone: 'light', label: 'GESTOR' },
  render: (args) => (
    <div className="bg-fg-strong p-6">
      <NinoLogo {...args} />
    </div>
  ),
}
