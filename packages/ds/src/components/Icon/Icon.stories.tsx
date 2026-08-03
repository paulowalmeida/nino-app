import type { Meta, StoryObj } from '@storybook/react'

import { Icon } from './Icon'
import { ICON_NAMES } from './Icon.types'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'trash', size: 'md' },
  argTypes: {
    name: {
      control: 'select',
      options: ICON_NAMES,
      description: 'Icon to render — the single source for every app',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Preset box size; className can still override it',
    },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {}

/** The three preset sizes, side by side. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Icon name="trash" size="sm" />
      <Icon name="trash" size="md" />
      <Icon name="trash" size="lg" />
    </div>
  ),
}

/** Icons follow the surrounding text colour through `currentColor`. */
export const FollowsTextColour: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-brand">
        <Icon name="heart" size="lg" />
      </span>
      <span className="text-subtle">
        <Icon name="heart" size="lg" />
      </span>
      <span className="text-ink">
        <Icon name="heart" size="lg" />
      </span>
    </div>
  ),
}

/** The whole catalog — every name accepted by the `name` prop. */
export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-4">
      {ICON_NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Icon name={name} />
          <span className="text-[10px] break-all text-gray-400">{name}</span>
        </div>
      ))}
    </div>
  ),
}
