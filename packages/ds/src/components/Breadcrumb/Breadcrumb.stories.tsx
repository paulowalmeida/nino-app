import type { Meta, StoryObj } from '@storybook/react'

import { Breadcrumb } from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Orders', href: '#' },
      { label: '#1234' },
    ],
  },
  argTypes: {
    separator: {
      description:
        'Separator between items. Leave empty for the default chevron `>`; type any character (e.g. `/`) for a text separator.',
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof Breadcrumb>

/** Chevron (default) — omit `separator` or leave it empty in the controls. */
export const ChevronSeparator: Story = {}

/** Slash — pass `"/"` to the `separator` prop. Try other characters in the controls. */
export const SlashSeparator: Story = {
  args: { separator: '/' },
}

/** Side-by-side comparison of both separator styles. */
export const Comparison: Story = {
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <div>
        <p className='mb-1 text-xs font-medium text-gray-400 uppercase tracking-wide'>Chevron (default)</p>
        <Breadcrumb {...args} />
      </div>
      <div>
        <p className='mb-1 text-xs font-medium text-gray-400 uppercase tracking-wide'>Slash</p>
        <Breadcrumb {...args} separator='/' />
      </div>
    </div>
  ),
}
