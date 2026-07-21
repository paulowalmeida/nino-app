import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Menu } from './Menu'

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Menu>

export const Default: Story = {
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    items: [
      { value: 'edit', label: 'Edit' },
      { value: 'duplicate', label: 'Duplicate' },
      { separator: true },
      { value: 'delete', label: 'Delete', destructive: true },
    ],
  },
}

/**
 * `contentClassName`/`itemClassName` para superfícies com tema próprio
 * (ex.: uma sidebar escura), onde as cores padrão do Menu não fazem sentido.
 */
export const OnDarkSurface: Story = {
  render: () => (
    <div className="rounded-2xl bg-gray-900 p-8">
      <Menu
        trigger={<Button variant="inverseOutline">Store</Button>}
        contentClassName="bg-gray-800 border-white/10"
        itemClassName="text-white/70 data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
        items={[
          { value: 'unit-a', label: 'Unidade A' },
          { value: 'unit-b', label: 'Unidade B' },
        ]}
      />
    </div>
  ),
}
