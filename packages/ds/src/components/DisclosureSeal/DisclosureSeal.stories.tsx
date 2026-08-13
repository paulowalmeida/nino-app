import type { Meta, StoryObj } from '@storybook/react'

import { Collapsible } from '../Collapsible/Collapsible'
import { Text } from '../Text/Text'
import { DisclosureSeal } from './DisclosureSeal'

const meta: Meta<typeof DisclosureSeal> = {
  title: 'Components/DisclosureSeal',
  component: DisclosureSeal,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DisclosureSeal>

/**
 * On its own the seal never turns: it reads the state of the trigger around
 * it, so this is what it looks like parked outside one.
 */
export const Resting: Story = {
  render: () => <DisclosureSeal />,
}

/**
 * In place: the chevron spins and the stamp fills with brand ink as the
 * panel opens.
 */
export const InsideACollapsible: Story = {
  render: () => (
    <div className="w-80">
      <Collapsible indicator trigger="Horários de funcionamento">
        <Text size="sm">Segunda a sexta, das 18h às 23h.</Text>
      </Collapsible>
    </div>
  ),
}
