import { maskCpf } from '@ds/lib/masks/masks'
import type { Meta, StoryObj } from '@storybook/react'

import { MaskedInput } from './MaskedInput'

const meta: Meta<typeof MaskedInput> = {
  title: 'Components/MaskedInput',
  component: MaskedInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MaskedInput>

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <MaskedInput mask={maskCpf} placeholder="000.000.000-00" />
    </div>
  ),
}
