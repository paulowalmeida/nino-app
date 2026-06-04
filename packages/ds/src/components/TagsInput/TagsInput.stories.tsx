import type { Meta, StoryObj } from '@storybook/react'

import { TagsInput } from './TagsInput'

const meta: Meta<typeof TagsInput> = {
  title: 'Components/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  args: { placeholder: 'Type and press Enter...' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TagsInput>

export const Default: Story = {}

export const WithTags: Story = {
  args: { defaultValue: ['savory', 'sweet', 'drink'] },
}

export const WithError: Story = {
  args: { defaultValue: ['invalid'], error: true },
}
