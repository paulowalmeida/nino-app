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
  args: { mask: maskCpf, placeholder: '000.000.000-00' },
  render: (args) => (
    <div className="w-64">
      <MaskedInput {...args} />
    </div>
  ),
}
