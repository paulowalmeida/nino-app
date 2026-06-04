import type { Meta, StoryObj } from '@storybook/react'

import { Accordion } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

const items = [
  {
    value: 'hours',
    trigger: 'Opening hours',
    content: 'Monday to Friday: 8am–10pm. Saturday: 10am–8pm. Sunday: closed.',
  },
  {
    value: 'delivery',
    trigger: 'Delivery area',
    content: 'We deliver within a 10 km radius from the store.',
  },
  {
    value: 'payment',
    trigger: 'Payment methods',
    content: 'We accept Pix, debit and credit cards (up to 12 installments).',
  },
]

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Accordion items={items} />
    </div>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Accordion items={items} defaultValue={['hours']} />
    </div>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Accordion items={items} multiple defaultValue={['hours', 'delivery']} />
    </div>
  ),
}
