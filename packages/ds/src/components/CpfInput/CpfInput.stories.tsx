import type { Meta, StoryObj } from '@storybook/react'

import { CpfInput } from './CpfInput'

const meta: Meta<typeof CpfInput> = {
  title: 'Components/CpfInput',
  component: CpfInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CpfInput>

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <CpfInput />
    </div>
  ),
}
