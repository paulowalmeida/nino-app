import type { Meta, StoryObj } from '@storybook/react'

import { CnpjInput } from './CnpjInput'

const meta: Meta<typeof CnpjInput> = {
  title: 'Components/CnpjInput',
  component: CnpjInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CnpjInput>

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <CnpjInput {...args} />
    </div>
  ),
}
